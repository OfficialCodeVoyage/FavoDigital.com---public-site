# FavoDigital — Project Context (GSD)

**What:** Public marketing site for FavoDigital — a web design, digital marketing &
AI web studio (Denver, CO & remote across the US). Currently a single-page "coming
soon" holding site; the gamified honeycomb hero is the centerpiece.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
(CSS-var design tokens in `globals.css`) · fonts Geist/Geist Mono/Fraunces ·
deployed on Vercel (auto-deploys on push to `main`).

**Brand:** "favo" = honeycomb → honey-amber accent (`--amber #f5a623`) + hexagon
motif. Brand/SEO single source of truth: `src/lib/site.ts`. Hex glyph helper:
`HexText` in `src/components/HexGlyph.tsx`.

**Standing constraints:**
- ESLint clean — no `any`, no unused vars.
- Semantic & accessible HTML — visible keyboard focus, proper landmarks.
- Respect `prefers-reduced-motion` (CSS helper `.favo-rise` already handles it).
- NEVER ship `noindex` on production.
- All page copy reads from `site` — no hardcoded strings.

**GSD model profile:** `quality` → Opus for all phases.

_Created 2026-06-28._
