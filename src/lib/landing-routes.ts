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
  /** Unique body copy — a string, or an array of paragraphs. Substantial enough to clear the soft-404 bar. */
  body: string | readonly string[];
  /** Prefilled mailto subject for the email CTA. */
  mailtoSubject: string;
  /** Page-specific highlights (3 topical sub-points). Falls back to site.services if omitted. */
  highlights?: readonly { title: string; description: string }[];
  /** Index + include in the sitemap. Defaults to true; set false to soft-land a junk path. */
  index?: boolean;
  /**
   * If set, this page canonicalizes to another path (e.g. "/seo-services") instead of
   * itself, and is excluded from the sitemap. Use to keep an old slug resolving (200)
   * while consolidating its ranking signals into the canonical page — avoids thin
   * near-duplicate pages competing with each other.
   */
  canonicalTo?: string;
}

/*
 * Seeded with the two confirmed-traffic Shopify URLs plus topically-aligned SERVICE
 * pages reclaimed from the previous favodigital.com (a prior marketing agency whose
 * indexed URLs still carry residual signals). Junk/hacked paths, thin variants, blog
 * posts and category archives are intentionally left to the branded 404. Each page
 * carries its own copy + highlights so they read as distinct, not templated.
 */
export const landingRoutes: readonly LandingRoute[] = [
  {
    slug: "shopify-website",
    title: "Shopify Website Design, Built to Convert",
    description:
      "Custom Shopify website design and development from FavoDigital — bespoke themes, fast load times, and a checkout tuned to convert. Launching 2026.",
    eyebrow: "Shopify — design & build",
    heading: "Storefronts that turn carts into checkouts",
    body: [
      "FavoDigital builds Shopify storefronts from a custom theme up — quick to load, clean to navigate, and shaped so the checkout actually closes. We open to clients in 2026, and the first builds are being lined up now.",
      "Tell us what you sell and where you want to grow, and we'll plan the store around it. Send a short brief to paul@favodigital.com to claim a place on the early list.",
    ],
    highlights: [
      { title: "Custom theme design", description: "We design and build your theme from scratch — no bloated template, just your brand and the way you sell." },
      { title: "Fast by default", description: "Lean code and right-sized images keep pages loading quickly on the phones your customers actually shop from." },
      { title: "Checkout that converts", description: "We tighten the path from product to payment so fewer carts stall and more orders go through." },
    ],
    mailtoSubject: "Shopify website brief — FavoDigital",
  },
  {
    slug: "free-shopify-website-offer",
    title: "Free Shopify Website — Limited Launch Offer",
    description:
      "Ahead of our 2026 launch, FavoDigital is building free Shopify stores for a select few brands — full design, a custom theme, and a checkout tuned to sell. Send a brief.",
    eyebrow: "Shopify — launch offer",
    heading: "Free Shopify builds, for a select few",
    body: [
      "Ahead of our 2026 launch, FavoDigital is giving a small number of brands a complete Shopify store, built free — design, a custom theme, and a checkout tuned to convert, with no fee attached. It's selective on purpose: we take only a few, so each store gets real attention rather than a template.",
      "If that sounds like your brand, send a short brief — your product, your timeline, and where you want to be selling. We'll tell you honestly whether it's a fit and exactly what happens next.",
    ],
    highlights: [
      { title: "A complete build", description: "A designed Shopify storefront, custom theme, and tuned checkout — set up to sell, at no cost to you." },
      { title: "Selective by design", description: "We accept only a few brands before launch, so every store gets full, undivided attention." },
      { title: "What we ask back", description: "In place of a fee, an honest testimonial and the room to feature the finished work." },
    ],
    mailtoSubject: "Free Shopify website offer — brief",
  },
  {
    slug: "lead-generation",
    title: "Lead Generation Systems for Qualified Inquiries",
    description:
      "Lead generation systems: landing pages, funnels, and search and paid campaigns built to produce qualified inquiries. Launching 2026 — send a short brief.",
    eyebrow: "Lead generation — funnels & campaigns",
    heading: "Turn clicks into qualified inquiries",
    body: [
      "Lead generation is the whole system, not a single ad: landing pages, funnels, and search and paid campaigns working together so the inquiries that reach you are worth answering. We tie the offer, the page, and the traffic to one number — qualified leads.",
      "FavoDigital opens in 2026, and we're lining up a small slate of projects now. Send a short brief — your offer, your market, and what a good lead looks like — and we'll map the system that gets you there.",
    ],
    highlights: [
      { title: "Landing pages & funnels", description: "Focused pages and step-by-step funnels that carry a visitor from first click to a booked inquiry." },
      { title: "Search & paid campaigns", description: "Google and paid social spend aimed at the searches and audiences most likely to convert." },
      { title: "Tracking & qualification", description: "Conversion tracking and lead scoring so you see what works and chase only the inquiries worth your time." },
    ],
    mailtoSubject: "Lead generation brief — FavoDigital",
  },
  {
    slug: "seo-services",
    title: "SEO Services — Technical, Content & Authority",
    description:
      "SEO built to compound — technical foundations, intent-led content and earned authority that keep customers finding you. Denver & remote US; briefs open for 2026.",
    eyebrow: "Organic search — SEO",
    heading: "SEO is a system, not a switch.",
    body: [
      "Search is the rare channel that keeps working long after you stop paying for it — when it's built right. FavoDigital's SEO joins three kinds of work that compound: a fast, technically clean foundation, content mapped to real search intent, and authority earned link by honest link.",
      "The full SEO service goes live with our 2026 launch, but the studio is already reviewing briefs. Tell us your site, your market, and the searches you want to own — we'll map where the compounding starts.",
    ],
    highlights: [
      { title: "Technical SEO", description: "Fast, crawlable architecture — Core Web Vitals, clean indexation and schema so search engines and AI answers can read and trust your site." },
      { title: "Content & on-page", description: "Pages mapped to real search intent and written to answer the question better than whatever ranks today." },
      { title: "Digital PR & authority", description: "Links and mentions earned the honest way, so your domain's credibility compounds instead of fading." },
    ],
    mailtoSubject: "SEO services brief",
  },
  {
    // The old "best SEO services" URL — kept resolving (200) for any residual signals,
    // but canonicalized into the cleaner /seo-services page to avoid two SEO pages
    // competing. Distinct "competitive top rankings" angle so it isn't a dead clone.
    slug: "best-seo-services-for-top-rankings",
    title: "SEO Built to Win Competitive Top Rankings",
    description:
      "FavoDigital's competitive SEO targets the top of page one — closing the gap on hard keywords and outranking the names already there. Launching 2026; send a brief.",
    eyebrow: "SEO — competitive rankings",
    heading: "Take the top of page one",
    body: [
      "Some search terms are contested for years, and the businesses sitting above you didn't land there by accident. This is FavoDigital's SEO built for exactly that fight — closing the gap on competitive keywords and earning the top of page one, not settling for a respectable spot on page two.",
      "We're a Denver studio working remote across the US, and this work opens as part of our 2026 launch. Send a brief now with the rankings you want and who's ahead of you, and we'll map what it takes to pass them.",
    ],
    highlights: [
      { title: "Competitive analysis", description: "We study the pages holding the top spots and pinpoint the exact gap between you and them." },
      { title: "Content built to outrank", description: "Depth, structure, and intent match aimed at beating the current number one — not just existing alongside it." },
      { title: "Authority & links", description: "Digital PR and earned signals that move you past entrenched competitors for good." },
    ],
    mailtoSubject: "SEO brief — competing for top rankings",
    canonicalTo: "/seo-services",
  },
  {
    slug: "google-advertising-management-services",
    title: "Google Ads & PPC Management That Converts",
    description:
      "FavoDigital manages Google Ads and PPC end to end — high-intent targeting, sharp ad creative, and disciplined budgets tuned to cost-per-acquisition. Launching 2026.",
    eyebrow: "Digital marketing — Google Ads",
    heading: "Clicks that pay their way",
    body: [
      "Google Ads is where buyers show up the moment they are ready — and where a loose budget bleeds fast. We manage PPC across the whole chain: the keywords you bid on, the copy that earns the click, and the landing page that closes it, all measured against cost-per-acquisition rather than raw traffic.",
      "Full Google Ads and PPC management opens with the FavoDigital studio in 2026. If you are already spending — or about to start — send a short brief now and we will map the first campaigns before launch.",
    ],
    highlights: [
      { title: "Search & Shopping", description: "High-intent search, Shopping, and remarketing campaigns aimed at the queries that signal real buying intent." },
      { title: "Creative & landing pages", description: "Ad copy and matching landing experiences built to turn the click into a qualified enquiry or sale." },
      { title: "Budget & bid control", description: "Bid strategy, spend allocation, and conversion tracking that cut wasted clicks and report on cost-per-acquisition." },
    ],
    mailtoSubject: "Google Ads / PPC management brief",
  },
  {
    slug: "facebook-ads-marketing",
    title: "Facebook & Instagram (Meta) Ads Management",
    description:
      "Facebook & Instagram ad campaigns by FavoDigital — Meta creative, sharp targeting and constant testing built to reach the right buyers and sell. Launching 2026; briefs open now.",
    eyebrow: "Meta ads — Facebook & Instagram",
    heading: "Stop the scroll, earn the sale.",
    body: [
      "Facebook and Instagram are interruption channels — nobody's searching, they're scrolling, so the work has to earn the stop and then the sale. FavoDigital builds Meta campaigns around exactly that: creative that holds the thumb, audiences mapped to who actually buys, and disciplined testing that finds what converts before the budget thins out.",
      "This dedicated Meta ads page opens with our 2026 launch, but the studio is already taking briefs. Tell us what you sell and who it's for, and we'll map the campaign with you.",
    ],
    highlights: [
      { title: "Scroll-stopping creative", description: "Hooks, video and static built to win the first three seconds and carry your offer before the thumb moves on." },
      { title: "Audience & targeting", description: "Lookalikes, interest stacks and retargeting aimed at the people most likely to buy — not the widest possible reach." },
      { title: "Testing & iteration", description: "Structured tests across creative, audience and placement, so spend keeps shifting toward whatever is actually converting." },
    ],
    mailtoSubject: "Facebook & Instagram ads inquiry",
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing — Organic & Paid Social",
    description:
      "FavoDigital runs social media marketing — organic content and paid ads working together across Instagram, Facebook, TikTok and LinkedIn. Launching 2026; taking briefs now.",
    eyebrow: "Digital marketing — social media",
    heading: "Show up where your audience scrolls.",
    body: [
      "Social media marketing only pays off when organic and paid pull in the same direction. FavoDigital runs both as one system across Instagram, Facebook, TikTok and LinkedIn — content that earns a following, and paid budget that puts the right posts in front of people ready to act.",
      "This dedicated page goes live with our 2026 launch, but the studio is already taking briefs. Tell us where your audience actually spends its time, and we'll map the channel mix with you.",
    ],
    highlights: [
      { title: "Organic content & community", description: "Posts, stories and replies that build a following and keep it warm between campaigns." },
      { title: "Paid social", description: "Targeted Instagram, Facebook, TikTok and LinkedIn ads that put spend where it returns." },
      { title: "Channel strategy & fit", description: "We pick the platforms your audience actually uses and shape content to suit each one." },
    ],
    mailtoSubject: "Social media marketing enquiry",
  },
  {
    slug: "website-design-content-creation",
    title: "Web Design & Content Creation, Built to Convert",
    description:
      "FavoDigital pairs bespoke, fast-loading websites with the copy and visuals that convert. A Denver web studio launching in 2026 — send a brief and start early.",
    eyebrow: "Web design — content creation",
    heading: "Design and words, built together",
    body: [
      "FavoDigital builds bespoke, fast websites and writes the content that makes them work — page copy, structure, and visuals shaped to convert rather than decorate. Most sites ship with placeholder words bolted on later; ours arrive finished, with design and message made for each other.",
      "We're a Denver web studio opening in 2026 and working remote across the US. If you have a build on the horizon, send a short brief now — we'll map the pages, the message, and the look together before the launch queue fills.",
    ],
    highlights: [
      { title: "Bespoke design & build", description: "Hand-built, fast-loading sites with no templates — tuned for the way real visitors read, scan, and click." },
      { title: "Conversion copywriting", description: "Page structure and words written to carry your message clearly and move the right people to act." },
      { title: "Visuals & art direction", description: "Imagery, photography direction, and graphics chosen to support the message instead of filling space." },
    ],
    mailtoSubject: "Brief: web design + content creation",
  },
];

/** Look up a registry entry from catch-all segments (joined with "/"). */
export function findLandingRoute(segments: string[]): LandingRoute | undefined {
  const path = segments.join("/");
  return landingRoutes.find((route) => route.slug === path);
}
