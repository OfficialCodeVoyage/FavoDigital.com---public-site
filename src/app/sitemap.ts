import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { landingRoutes } from "@/lib/landing-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Known backlink landing pages (registry-driven). The 404 is never listed, and
    // pages that canonicalize elsewhere (canonicalTo) are excluded as non-canonical.
    ...landingRoutes
      .filter((route) => route.index !== false && !route.canonicalTo)
      .map((route) => ({
        url: `${siteUrl}/${route.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
