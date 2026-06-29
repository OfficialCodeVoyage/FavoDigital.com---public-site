/**
 * Registry of known backlink landing pages.
 *
 * Inbound backlinks point at URLs the site doesn't have yet. Each entry below
 * becomes a real, indexable "coming soon" page (HTTP 200, listed in the sitemap)
 * served by the root catch-all `src/app/[...slug]/page.tsx`. Every URL NOT listed
 * here falls through to the branded 404 (`src/app/not-found.tsx`).
 *
 * To cover a new backlink: add one object and deploy. Discover active backlinks
 * via Google Search Console (Links → Top linked pages) and Vercel
 * Observability/Logs (filter to 404s). Copy lives here, not in JSX — this is the
 * single source of truth for landing-page text.
 */
export interface LandingRoute {
  /** Path relative to root, no leading/trailing slash. Nesting allowed, e.g. "category/seo/audit". */
  slug: string;
  /** <title> — the root layout template appends " · FavoDigital". */
  title: string;
  /** Meta description — keep unique per page (avoids duplicate content). */
  description: string;
  /** Mono eyebrow/kicker above the headline. */
  eyebrow: string;
  /** Fraunces <h1>. */
  heading: string;
  /** Unique body copy (3–4 sentences) — substantial enough to clear the soft-404 bar. */
  body: string;
  /** Prefilled mailto subject for the email CTA. */
  mailtoSubject: string;
  /** Index + include in the sitemap. Defaults to true; set false to soft-land a junk path. */
  index?: boolean;
}

export const landingRoutes: readonly LandingRoute[] = [
  {
    slug: "shopify-website",
    title: "Shopify Website Design & Development",
    description:
      "FavoDigital designs and builds fast, conversion-focused Shopify websites — custom themes, quick load times and checkout tuned to sell. Launching 2026; taking briefs now.",
    eyebrow: "Shopify — web design & development",
    heading: "Shopify websites, built to convert.",
    body: "FavoDigital builds bespoke, fast-loading Shopify storefronts — custom themes, considered UX and checkout flows engineered to convert, the same way we approach every site we ship. This dedicated Shopify page goes live with our 2026 launch, but the studio is already taking briefs. Tell us about your store and we'll map the build with you.",
    mailtoSubject: "Shopify website enquiry",
  },
  {
    slug: "free-shopify-website-offer",
    title: "Free Shopify Website Offer",
    description:
      "A limited launch-window offer from FavoDigital: a free, conversion-focused Shopify website for a few select brands ahead of our 2026 launch. Enquire to check eligibility.",
    eyebrow: "Shopify — limited launch offer",
    heading: "A free Shopify website to launch your 2026.",
    body: "Ahead of our 2026 launch, FavoDigital is building a small number of Shopify storefronts at no cost — fast, modern and built to convert — to prove our approach with real brands. Slots are limited and selective. Tell us about your business and what you sell, and we'll let you know if you're a fit for a free launch build.",
    mailtoSubject: "Free Shopify website offer",
  },
];

/** Look up a registry entry from catch-all segments (joined with "/"). */
export function findLandingRoute(segments: string[]): LandingRoute | undefined {
  const path = segments.join("/");
  return landingRoutes.find((route) => route.slug === path);
}
