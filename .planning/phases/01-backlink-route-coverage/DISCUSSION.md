# Phase 01 — Discussion

_Captured 2026-06-28. Decisions confirmed with the user before planning._

## Problem
The site is a single page (`/`). Backlinks drive real traffic to URLs that don't
exist; they hit Next.js's default 404 and dead-end. Lost leads + lost backlink equity.

## Options weighed
1. **Mass redirect everything → `/`.** Rejected — Google treats mass "redirect
   unrelated URLs to homepage" as a soft 404 (equity doesn't transfer) and the
   visitor loses all context (e.g. someone who clicked "Free Shopify Offer" lands on
   a generic page). Reads as broken.
2. **Branded custom 404.** ✅ Chosen — honest 404 status (SEO-safe; Google holds the
   URL and re-crawls), on-brand, with a home link + email CTA so leads aren't lost.
3. **Real indexable landing stubs for known backlink URLs.** ✅ Chosen — 200 status,
   in sitemap, so those specific backlinks point to real content (equity preserved).

## Decisions (locked)
- **D1:** Branded custom 404 (`not-found.tsx`), genuine 404 status.
- **D2:** Real, indexable 200 landing pages for known backlink URLs, in the sitemap.
- **D3:** Registry-driven & scalable — adding a backlink page = one config entry, not
  a new file. Seed with the two confirmed URLs (`shopify-website`,
  `free-shopify-website-offer`); expand as more are discovered via GSC / Vercel logs.
- **D4:** Execute via GSD with full `.planning/` artifacts, discussion included.
- **D5:** GSD runs on the Opus model profile (`model_profile=quality`).

## Constraints carried in
ESLint-clean (no `any`/unused), accessible/semantic HTML, respect
`prefers-reduced-motion`, never `noindex` in prod, all copy from `site`.

## Discovering the rest of the active backlinks (follow-up, not blocking)
- Google Search Console → Links → Top linked pages (authoritative backlink targets).
- Vercel → Observability/Logs filtered to 404s over ~30 days (what's actually hit).
- Curate (skip junk/scraper paths like `/category/seo/...` — leave to the 404, or add
  with `index:false`), drop keepers into the registry, push → auto-deploy.
