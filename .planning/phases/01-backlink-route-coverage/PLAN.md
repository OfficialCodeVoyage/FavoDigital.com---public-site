# Phase 01 — Plan

_Model profile: quality (Opus). Next 16 internals verified against installed source._

## Approach
One shared `HoldingCard` (Server Component) renders both the branded 404 and every
registry-driven landing page. A required root catch-all (`[...slug]`) with
`dynamicParams=false` statically renders known backlink slugs as indexable 200s and
lets every other path fall through to a true 404 (`not-found.tsx`).

## Next 16.2.9 verifications (from node_modules source)
- `dynamicParams=false` → `FallbackMode.NOT_FOUND` (`next/dist/build/static-paths/app.js`):
  any slug not produced by `generateStaticParams` returns a real 404 + renders
  `not-found.tsx`. No manual `notFound()` needed for unknown paths.
- **Required** `[...slug]` (not optional `[[...slug]]`) does NOT match `/` — the home
  `page.tsx` wins; metadata routes (`robots.ts`/`sitemap.ts`/`manifest.ts`/
  `opengraph-image.tsx`/`icon.svg`) are higher-precedence and never reach the catch-all.
- `params` is a **Promise** in 16: `params: Promise<{ slug: string[] }>`, `await` it.
  `generateStaticParams()` returns plain `{ slug: string[] }[]`.
- `not-found.tsx` returns a genuine 404 AND supports `export const metadata` in 16.2.9.

## Tasks (atomic commits)
1. **`src/lib/site.ts`** — add `site.ui.homeLink: "Back to the home page"` and a
   `site.notFound` block (`metaTitle`, `eyebrow`, `title`, `body`, `mailtoSubject`).
2. **`src/lib/landing-routes.ts`** (NEW) — `LandingRoute` interface +
   `landingRoutes` (seed: `shopify-website`, `free-shopify-website-offer`, with
   substantial unique `body`/`heading`/`description`) + `findLandingRoute(segments)`.
3. **`src/components/HoldingCard.tsx`** (NEW) + **`HoldingCard.module.css`** —
   shared Server Component. Owns `<main className="h-dvh overflow-y-auto">` + inner
   `min-h-full grid place-items-center` (defeats global `body{overflow:hidden}`).
   Props: `eyebrow, title, body, mailtoSubject, primaryHref?, primaryLabel?,
   emailPrompt?, highlights?, stamp?`. Reuses `HexText` wordmark, `.favo-rise`
   entrance (reduced-motion via CSS), `encodeURIComponent` on mailto subject, single
   `<h1>`, descriptive link text, `:focus-visible` amber ring. Tokens:
   `--amber/--paper/--muted/--font-*`.
4. **`src/app/not-found.tsx`** (NEW) — `metadata.title = site.notFound.metaTitle`;
   renders `<HoldingCard>` from `site.notFound` (no highlights). True 404; not in sitemap.
5. **`src/app/[...slug]/page.tsx`** (NEW) — `dynamicParams=false`,
   `generateStaticParams` from registry (split slug on `/`), `generateMetadata` with
   per-entry title/description + **self `alternates.canonical`** (critical — child
   overrides layout's `/`) + `robots:{index:false}` when `entry.index===false`.
   Renders `<HoldingCard highlights={site.services} stamp={site.prelaunch}>`.
   Defensive `notFound()` for type-narrowing.
6. **`src/app/sitemap.ts`** (EDIT) — keep `/` at priority 1; append
   `landingRoutes.filter(r => r.index !== false)` at priority 0.8, `monthly`.
7. **`src/app/robots.ts`** — NO CHANGE.

## Thin-content guard
Each landing page ships unique title + description + self-canonical + real `<h1>` + a
substantial unique `body` (3–4 sentences) + the `site.services` highlights grid +
descriptive internal link + the global Organization/WebSite JSON-LD. The unique
differentiator is the per-entry `body`/`heading`/`description` (the services grid is shared).

## Verification
`npm run lint` (clean) · `npm run build` (stubs prerender; `/_not-found` present) ·
`npm run start` then `curl -I`: `/shopify-website`+`/free-shopify-website-offer` → 200;
`/totally-made-up` + `/category/seo/whatever` → 404; `/`, `/sitemap.xml`,
`/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, `/icon.svg` → 200.
`curl -s` checks: stub `<title>` includes "· FavoDigital" + self `canonical`; 404 has
title + `mailto`; sitemap lists both stubs, not `not-found`. Manual: URL-encoded
mailto subject, amber `:focus-visible` ring, reduced-motion suppresses `.favo-rise`,
short/narrow viewport scrolls within `<main>` without top-clipping.
