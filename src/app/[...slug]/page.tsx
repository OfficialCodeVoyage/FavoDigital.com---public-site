import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HoldingCard } from "@/components/HoldingCard";
import { site } from "@/lib/site";
import { landingRoutes, findLandingRoute } from "@/lib/landing-routes";

/**
 * Root catch-all for known backlink landing pages.
 *
 * With `dynamicParams = false`, only slugs returned by `generateStaticParams`
 * render (static, indexable 200s); every other path returns a genuine 404 and
 * renders `not-found.tsx`. A required `[...slug]` (not optional `[[...slug]]`)
 * never matches `/` — the home `page.tsx` owns that — and the metadata routes
 * (robots/sitemap/manifest/opengraph-image/icon) take higher precedence.
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string[] }[] {
  return landingRoutes.map((route) => ({ slug: route.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findLandingRoute(slug);
  if (!entry) return {};

  const path = `/${entry.slug}`;
  return {
    title: entry.title,
    description: entry.description,
    // Self-referential canonical — required, or the page inherits the layout's "/"
    // canonical and won't be indexed separately.
    alternates: { canonical: path },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: path,
    },
    ...(entry.index === false ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const entry = findLandingRoute(slug);
  if (!entry) notFound();

  return (
    <HoldingCard
      eyebrow={entry.eyebrow}
      title={entry.heading}
      body={entry.body}
      mailtoSubject={entry.mailtoSubject}
      highlights={site.services}
      stamp={site.prelaunch}
    />
  );
}
