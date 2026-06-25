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
  tagline: "Websites & AI, built to perform.",
  description:
    "FavoDigital is a web design, development and AI studio. We build fast, modern websites, digital marketing systems and AI-powered web experiences for ambitious brands.",
  /** Short copy for OG/Twitter cards and meta description fallbacks. */
  ogDescription:
    "Web design, development, digital marketing and AI-powered web experiences for ambitious brands.",
  services: [
    {
      title: "Web Design & Development",
      description:
        "Custom, high-performance websites and web apps — designed, built and shipped end to end.",
    },
    {
      title: "Digital Marketing & SEO",
      description:
        "Search, content and conversion systems that turn traffic into customers.",
    },
    {
      title: "AI Web Solutions",
      description:
        "AI assistants, automation and intelligent web features wired into your product.",
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
  themeColor: "#0B0E14",
  accentColor: "#F5B642",
  locale: "en_US",
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
