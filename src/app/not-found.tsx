import type { Metadata } from "next";
import { HoldingCard } from "@/components/HoldingCard";
import { site } from "@/lib/site";

/**
 * Branded 404. Next.js serves this for any unmatched URL (and for `notFound()`)
 * with a genuine HTTP 404 status, so it's SEO-honest — Google holds the URL and
 * re-crawls rather than indexing a placeholder. Kept out of the sitemap.
 */
export const metadata: Metadata = {
  title: site.notFound.metaTitle,
};

export default function NotFound() {
  return (
    <HoldingCard
      eyebrow={site.notFound.eyebrow}
      title={site.notFound.title}
      body={site.notFound.body}
      mailtoSubject={site.notFound.mailtoSubject}
      stamp={site.prelaunch}
    />
  );
}
