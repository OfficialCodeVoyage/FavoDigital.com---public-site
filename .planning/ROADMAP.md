# Roadmap

## Phase 01 — Backlink route coverage: branded 404 + registry-driven landing stubs

**Status:** in progress (started 2026-06-28)

**Goal:** Stop losing inbound backlink traffic that currently dead-ends on Next.js's
default 404. Known backlink URLs resolve to real, indexable "coming soon" landing
pages (HTTP 200) with an email CTA; every other unknown URL renders a branded,
honest 404 (HTTP 404) with a home link + email CTA. The landing pages are
registry-driven so adding a new one is a single config entry.

**Why now:** Vercel Analytics shows real traffic (Google + other backlinks) hitting
nonexistent URLs — `/shopify-website` (3), `/free-shopify-website-offer` (2),
`/category/seo/...` (1) — and dead-ending. That's lost leads and lost backlink
equity. Mass-redirecting everything to `/` reads as a soft 404 to Google and strips
visitor context; a real 200 page per known backlink plus an honest 404 for the rest
is the SEO-correct, lead-preserving choice — and the right dogfooding for an SEO studio.

**Deliverables:**
- `src/lib/landing-routes.ts` — typed registry of known backlink pages (+ lookup).
- `src/components/HoldingCard.tsx` (+ `.module.css`) — shared branded holding card.
- `src/app/not-found.tsx` — branded 404 (true 404 status).
- `src/app/[...slug]/page.tsx` — required catch-all, `dynamicParams=false`.
- `src/app/sitemap.ts` — generate entries from the registry.
- `src/lib/site.ts` — add `site.notFound` copy + `site.ui.homeLink`.

**Out of scope / follow-up:** populating the registry from the full Google Search
Console "Top linked pages" + Vercel 404 logs; per-page `Service` JSON-LD.

See `phases/01-backlink-route-coverage/PLAN.md`.
