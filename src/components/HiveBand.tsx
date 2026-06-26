import { site } from "@/lib/site";
import { HexText } from "./HexGlyph";
import styles from "./HiveBand.module.css";

/**
 * Folded SEO band — services + locality + contact + favicon wink — pinned to the
 * bottom of the single screen. All copy is server-rendered and crawlable. `entered`
 * is passed by the hero so the band joins the entrance choreography without
 * reaching into the stage's state selectors.
 */
export function HiveBand({ entered }: { entered: boolean }) {
  return (
    <section
      className={`${styles.band} ${entered ? styles.in : ""}`}
      aria-label="What FavoDigital does"
    >
      <h2 className="sr-only">What we do</h2>

      <ul className={styles.services}>
        {site.services.map((service) => (
          <li key={service.title} className={styles.svcItem}>
            <h3 className={styles.svcKicker}>{service.title}</h3>
            <p className={styles.svcBlurb}>{service.description}</p>
          </li>
        ))}
      </ul>

      <p className={styles.bandMeta}>
        <span className={styles.locality}>{site.ui.localityLabel}</span>
        <span className={styles.sep} aria-hidden="true" />
        <span className={styles.contact}>
          {site.ui.contactPrompt}{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </span>
        <span className={styles.sep} aria-hidden="true" />
        <span className={styles.wink}>
          <HexText
            text={site.ui.faviconWink}
            hexClassName={styles.winkHex}
            plain="We sweat the details — down to the favicon."
          />
        </span>
      </p>
    </section>
  );
}
