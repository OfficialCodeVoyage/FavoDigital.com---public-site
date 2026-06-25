import { site, socialUrls } from "@/lib/site";

/**
 * Organization + WebSite structured data.
 * Rendered once in the root layout so every page carries it.
 * Uses Organization (not LocalBusiness) — we advertise a service area, not a storefront.
 */
export function JsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      description: site.description,
      email: site.email,
      logo: `${site.url}/icon.svg`,
      image: `${site.url}/opengraph-image`,
      areaServed: site.serviceArea,
      knowsAbout: site.services.map((s) => s.title),
      sameAs: socialUrls,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-US",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ];

  const data = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, server-generated data — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
