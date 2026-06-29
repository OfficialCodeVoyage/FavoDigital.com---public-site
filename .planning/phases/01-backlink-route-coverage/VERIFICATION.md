# Phase 01 — Verification

_Run 2026-06-28 on the production build (`npm run build` + `npm run start`)._

## Static analysis & build
- `npm run lint` → **No issues found.**
- `npm run build` → compiled + typechecked clean. Route table:
  - `○ /` and `○ /_not-found` (static)
  - `● /[...slug]` → `/shopify-website` + `/free-shopify-website-offer` prerendered (SSG)
  - metadata routes (`robots.txt`, `sitemap.xml`, `manifest.webmanifest`,
    `opengraph-image`, `icon.svg`) intact, not shadowed.

## HTTP status codes (`curl -I`)
| Path | Expected | Actual |
|------|----------|--------|
| `/` | 200 | 200 ✓ |
| `/shopify-website` | 200 | 200 ✓ |
| `/free-shopify-website-offer` | 200 | 200 ✓ |
| `/totally-made-up` | 404 | 404 ✓ |
| `/category/seo/whatever` (nested) | 404 | 404 ✓ |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, `/icon.svg` | 200 | 200 ✓ |

## Metadata / SEO
- `/shopify-website`: `<title>Shopify Website Design & Development · FavoDigital</title>`,
  self-canonical `https://favodigital.com/shopify-website` (not `/`). ✓
- `/free-shopify-website-offer`: unique title + self-canonical. ✓
- 404: `<title>Page not found · FavoDigital</title>`, on-brand h1, mailto subject
  `Broken%20link%20on%20favodigital.com`. ✓
- `sitemap.xml`: home (priority 1) + both stubs (0.8, monthly); 404 excluded. ✓
- mailto subjects URL-encoded per surface. ✓

## Visual / a11y (Playwright)
- `/shopify-website` desktop (1280) + mobile (390): on-brand — Fav⬡Digital wordmark,
  amber eyebrow, Fraunces h1, crawlable services grid, amber CTA pill, email CTA,
  "COMING SOON — 2026" stamp. Services grid collapses to one column on mobile;
  content scrolls within `<main>` (no clipping under `body{overflow:hidden}`). ✓
- `/totally-made-up` 404: branded, lean (no services grid). ✓
- Single `<h1>` per page; `sr-only` section heading; `:focus-visible` amber rings;
  descriptive link text. Reduced motion handled by CSS `.favo-rise`.
- Only console errors are `/_vercel/insights/script.js` + `/_vercel/speed-insights/script.js`
  404ing locally (Vercel beacons; work in production). Not from app code.

**Result: PASS.** Ready to merge to `main` (auto-deploys to Vercel).
