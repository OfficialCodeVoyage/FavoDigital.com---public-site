/**
 * Single source of truth for site-wide brand, SEO and contact data.
 *
 * Everything that appears in metadata, JSON-LD, the sitemap and the UI should
 * read from here so the brand stays consistent and is trivial to update.
 *
 * NOTE: Items marked `TODO(confirm)` are placeholders to verify before launch
 * (real contact address / NAP, social profiles). Keep them accurate — they feed
 * structured data that search engines read.
 */

const PRODUCTION_URL = "https://favodigital.com";

/** Canonical origin. Overridable per-environment via NEXT_PUBLIC_SITE_URL. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL
).replace(/\/$/, "");

export const site = {
  name: "FavoDigital",
  legalName: "FavoDigital",
  url: siteUrl,
  /** Used in <title> templates and the OG site name. */
  shortName: "FavoDigital",
  tagline: "Websites & AI, made to perform.",
  description:
    "FavoDigital is a web design, development and AI studio. We build fast, modern websites, digital marketing systems and AI-powered web experiences for ambitious brands.",
  /** Short copy for OG/Twitter cards and meta description fallbacks. */
  ogDescription:
    "Web design, development, digital marketing and AI-powered web experiences for ambitious brands.",
  services: [
    {
      title: "Web Design & Development",
      description:
        "Bespoke, fast-loading sites built on Next.js — considered, and built to convert.",
    },
    {
      title: "Digital Marketing & SEO",
      description:
        "Search, content and campaigns that compound, so the right people find you first.",
    },
    {
      title: "AI Web Solutions",
      description:
        "Assistants and automations woven into your site to do real work — never gimmicks.",
    },
  ],
  /** Primary market. Service area, not a physical storefront. TODO(confirm). */
  serviceArea: "Denver, Colorado & remote — United States",
  email: "hello@favodigital.com", // TODO(confirm)
  /** Public social profiles → JSON-LD `sameAs`. Add as they go live. */
  social: {
    github: "https://github.com/OfficialCodeVoyage",
    // x: "https://x.com/...",        // TODO(add)
    // linkedin: "https://www.linkedin.com/company/...", // TODO(add)
  },
  /** Brand color used for theme-color, manifest and OG art. */
  themeColor: "#0E0D0B",
  accentColor: "#F5A623",
  /** Brand-only reveal payoff line — no email. ⬡ marks the amber hex glyph. */
  revealLine: "in your favo⬡r.",
  /** Pre-launch stamp shown on the holding page. */
  prelaunch: "Coming soon — 2026",
  locale: "en_US",

  /*
   * Holding-page on-screen copy — single source of truth for the hero UI.
   * `⬡` is a placeholder for the amber honeycomb-hex glyph; the component
   * swaps it for a styled <span> and exposes a plain reading to screen readers.
   */
  ui: {
    wordmark: "Fav⬡Digital",
    statusPrimary: "Studio — Denver, CO",
    statusSecondary: "Opening 2026",
    statusCompact: "Denver · 2026",
    eyebrow: "Web · Marketing · AI — a studio",
    heroLine1: "Websites & AI,",
    heroLine2: "made to perform.",
    subhead: [
      { t: "We craft ", em: false },
      { t: "fast, modern websites", em: true },
      { t: " and ", em: false },
      { t: "AI-driven experiences", em: true },
      {
        t: " — engineered to load light, convert with intent, and feel unmistakably yours.",
        em: false,
      },
    ],
    ctaHint: "Warm the hive",
    ctaSubHint: "drag — it spreads",
    meterSuffix: "warm",
    nearHint: "nearly first light…",
    revealStamp: "Launching 2026",
    resetLabel: "Cool the hive ↺",
    localityLabel: "Denver, Colorado — and remote across the United States.",
    contactPrompt: "Let's make something —",
    faviconWink: "We sweat the details — down to the fav⬡icon.",
  },
} as const;

/** Flattened list of public social URLs for JSON-LD `sameAs`. */
export const socialUrls = Object.values(site.social).filter(Boolean);

/** SEO keywords. Kept tight and on-niche — avoid keyword stuffing. */
export const keywords = [
  "web design agency",
  "web development",
  "digital marketing agency",
  "SEO agency",
  "AI web development",
  "AI website",
  "web studio",
  "FavoDigital",
];
