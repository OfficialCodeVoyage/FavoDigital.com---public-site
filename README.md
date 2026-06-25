# FavoDigital

Public marketing site for **FavoDigital** — a web design, development & AI studio.
We build fast, modern websites, digital-marketing systems and AI-powered web experiences for ambitious brands.

> 🚧 **Status:** coming-soon holding page. The gamified launch experience is in active design.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Geist](https://vercel.com/font) typeface via `next/font`
- Analytics: `@vercel/analytics` + `@vercel/speed-insights`
- Hosted on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Configuration

Copy `.env.example` to `.env.local` and adjust as needed:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin used for metadata, canonical URLs, sitemap and JSON-LD. Defaults to `https://favodigital.com`. |

**Brand & SEO data lives in [`src/lib/site.ts`](src/lib/site.ts)** — edit there, not inline in components.

## Project structure

```
src/
  app/            Routes + metadata route handlers (robots, sitemap, manifest, opengraph-image)
  components/     JsonLd, GamifiedHero
  lib/site.ts     Single source of truth for brand & SEO
public/           Static assets (brand icon)
```

## Deployment

Deployed on Vercel; pushes to `main` trigger a production deploy and every branch/PR gets a preview URL.
See [`CLAUDE.md`](CLAUDE.md) for contributor conventions and SEO ground rules.

---

© FavoDigital. All rights reserved.
