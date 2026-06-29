import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { HexText } from "@/components/HexGlyph";
import { StaticHive } from "@/components/StaticHive";
import styles from "./page.module.css";

/**
 * /about-us — a real, indexable studio About page (studio "we" voice, plain copy).
 * An explicit route, so it takes precedence over the `[...slug]` catch-all. Doubles
 * as a reclaim of the previous owner's still-indexed /about-us, restating the new
 * studio's identity for search + AI answers.
 */
export const metadata: Metadata = {
  title: site.about.metaTitle,
  description: site.about.metaDescription,
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: site.about.metaTitle,
    description: site.about.metaDescription,
    url: "/about-us",
  },
};

// Internal links from each service to its landing page (parallel to site.services).
const serviceHrefs = ["/website-design-content-creation", "/seo-services", "/"];

export default function AboutPage() {
  return (
    <main className={styles.viewport}>
      <StaticHive />
      <div className={styles.center}>
        <article className={`${styles.card} favo-rise`}>
          <p className={styles.wordmark}>
            <HexText
              text={site.ui.wordmark}
              hexClassName={styles.hex}
              plain="FavoDigital"
            />
          </p>

          <p className={styles.eyebrow}>{site.about.eyebrow}</p>
          <h1 className={styles.title}>{site.about.title}</h1>

          {site.about.intro.map((paragraph, i) => (
            <p key={i} className={styles.body}>
              {paragraph}
            </p>
          ))}

          <section className={styles.doSection} aria-labelledby="what-we-do">
            <h2 id="what-we-do" className={styles.doHeading}>
              {site.about.doLabel}
            </h2>
            <ul className={styles.doList}>
              {site.services.map((service, i) => (
                <li key={service.title} className={styles.doItem}>
                  <Link href={serviceHrefs[i] ?? "/"} className={styles.doLink}>
                    <span className={styles.doKicker}>{service.title}</span>
                    <span className={styles.doBlurb}>{service.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className={styles.locality}>{site.ui.localityLabel}</p>

          <div className={styles.actions}>
            <Link href="/" className={styles.primary}>
              {site.about.homeLink}
            </Link>
            <p className={styles.contact}>
              {site.ui.contactPrompt}{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>

          <p className={styles.stamp}>{site.prelaunch}</p>
        </article>
      </div>
    </main>
  );
}
