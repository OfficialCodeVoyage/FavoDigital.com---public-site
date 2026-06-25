# FavoDigital

FavoDigital — public marketing site (web design, digital marketing & AI web studio).

## Brand & positioning

FavoDigital is a studio that builds websites and AI-powered web work for clients, alongside digital marketing & SEO. Primary service area is **Denver, Colorado & remote across the United States**. The name **"favo"** means *honeycomb* — so the brand signature is a **honey-amber accent + hexagon motif**. Keep it tasteful and restrained; the full gamified identity is a deferred design pass.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** — `globals.css` uses `@import "tailwindcss";` with CSS-var design tokens
- Fonts: **Geist** + **Geist Mono** via `next/font/google`
- Deployed on **Vercel**
- Analytics via **@vercel/analytics** + **@vercel/speed-insights**

## Project structure

```
src/
  app/            Routes + metadata route handlers
                  (robots, sitemap, manifest, opengraph-image)
  components/     JsonLd, GamifiedHero
  lib/site.ts     Single source of truth for brand/SEO — EDIT BRAND DATA HERE
```

Import alias: `@/*` → `src/*`.

## SEO ground rules

- All brand/SEO data flows from **`src/lib/site.ts`** — edit brand data there, not inline in pages.
- **NEVER ship `noindex` on production.**
- Canonical URLs and `metadataBase` come from `siteUrl` (`NEXT_PUBLIC_SITE_URL` env, falls back to `https://favodigital.com`).
- Keep **Organization** and **WebSite** JSON-LD accurate.
- Confirm all `TODO(confirm)` items (email, social handles, NAP) before launch.

## Design status

This is a **coming-soon HOLDING page**. The gamified centerpiece is **DEFERRED** to a dedicated design pass and currently lives as a stub in **`src/components/GamifiedHero.tsx`**. When the design lands, **replace the component body but keep its public API** (the exported `GamifiedHero`).

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Deploy

- **Vercel** project, git-connected — auto-deploys on push to `main`.
- Production domain **favodigital.com** is attached separately.
- Every push gets a **preview deploy**.

## Conventions

- TypeScript **strict**.
- **ESLint clean** — no unused vars, no `any`.
- **Semantic & accessible HTML** — visible keyboard focus, proper landmarks.
- **Respect `prefers-reduced-motion`** (helper classes in `globals.css` already do).
