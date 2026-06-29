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

  // Reclaimed from the previous favodigital.com (a prior marketing agency whose
  // indexed URLs still carry backlinks). Only topically-aligned SERVICE pages the
  // new studio offers — junk/hacked paths, thin variants, blog posts and category
  // archives are intentionally left to the 404. If GSC later shows toxic backlinks
  // to any of these, flip `index: false` (one line) and disavow the referrers.
  {
    slug: "lead-generation",
    title: "Lead Generation",
    description:
      "FavoDigital builds lead-generation systems — landing pages, funnels and campaigns engineered to turn traffic into qualified enquiries. Launching 2026; taking briefs now.",
    eyebrow: "Digital marketing — lead generation",
    heading: "Lead generation that fills your pipeline.",
    body: "FavoDigital builds lead-generation systems that compound — fast landing pages, considered funnels, and search and paid campaigns tuned to bring you qualified enquiries, not vanity clicks. This service page goes live with our 2026 launch, but the studio is already taking briefs. Tell us who you're trying to reach and we'll map the system with you.",
    mailtoSubject: "Lead generation enquiry",
  },
  {
    slug: "best-seo-services-for-top-rankings",
    title: "SEO Services",
    description:
      "FavoDigital's SEO — technical, content and authority work that compounds, so the right people find you first. Denver & remote US. Launching 2026; taking briefs now.",
    eyebrow: "Digital marketing — SEO",
    heading: "SEO that earns the top of the page.",
    body: "FavoDigital does SEO the durable way — fast, technically clean builds, content that answers real intent, and authority that compounds over time, so the right people find you first instead of your competitors. This service page goes live with our 2026 launch, but the studio is already taking briefs. Tell us where you want to rank and we'll map the path.",
    mailtoSubject: "SEO services enquiry",
  },
  {
    slug: "google-advertising-management-services",
    title: "Google Ads Management",
    description:
      "FavoDigital manages Google Ads that convert — tight targeting, sharp creative and budgets spent where they pay back. Launching 2026; taking briefs now.",
    eyebrow: "Digital marketing — Google Ads",
    heading: "Google Ads, managed to pay back.",
    body: "FavoDigital runs Google Ads that respect your budget — tight targeting, sharp creative, and continuous optimisation so spend lands where it actually converts, not where it leaks. This service page goes live with our 2026 launch, but the studio is already taking briefs. Tell us your goals and we'll map the account with you.",
    mailtoSubject: "Google Ads management enquiry",
  },
  {
    slug: "facebook-ads-marketing",
    title: "Facebook & Instagram Ads",
    description:
      "FavoDigital builds Meta ad campaigns — Facebook & Instagram creative and targeting tuned to reach the right audience and sell. Launching 2026; taking briefs now.",
    eyebrow: "Digital marketing — Meta ads",
    heading: "Facebook & Instagram ads that sell.",
    body: "FavoDigital builds Meta campaigns that earn their keep — Facebook and Instagram creative, audience targeting, and testing tuned to reach the right people and turn attention into sales. This service page goes live with our 2026 launch, but the studio is already taking briefs. Tell us about your brand and we'll map the campaign.",
    mailtoSubject: "Facebook & Instagram ads enquiry",
  },
];

/** Look up a registry entry from catch-all segments (joined with "/"). */
export function findLandingRoute(segments: string[]): LandingRoute | undefined {
  const path = segments.join("/");
  return landingRoutes.find((route) => route.slug === path);
}
