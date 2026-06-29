import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { HexText } from "./HexGlyph";
import styles from "./HoldingCard.module.css";

export interface HoldingCardProps {
  /** Mono eyebrow/kicker above the headline. */
  eyebrow: string;
  /** Fraunces display headline — the page's single <h1>. */
  title: string;
  /** Body copy; an array renders one <p> per entry. */
  body: string | readonly string[];
  /** Prefilled mailto subject (URL-encoded by the component). */
  mailtoSubject: string;
  /** Primary link target. Defaults to "/". */
  primaryHref?: string;
  /** Primary link text. Defaults to site.ui.homeLink. */
  primaryLabel?: string;
  /** Prompt before the email link. Defaults to site.ui.contactPrompt. */
  emailPrompt?: string;
  /** Optional crawlable highlights (landing pages pass site.services). */
  highlights?: readonly { title: string; description: string }[];
  /** Optional status stamp (e.g. site.prelaunch). */
  stamp?: ReactNode;
}

/**
 * Shared branded holding surface behind both the 404 (`not-found.tsx`) and every
 * registry-driven backlink landing page (`[...slug]/page.tsx`). A Server Component
 * with no client JS — the entrance is the global `.favo-rise` class, which honors
 * `prefers-reduced-motion` in CSS.
 *
 * Owns its own scroll: the document `body` is globally `overflow: hidden` (the home
 * page is a fixed single screen), so the card centers inside a `100dvh` scroll
 * container and overflows internally — short content centers, tall content scrolls
 * with the top reachable.
 */
export function HoldingCard({
  eyebrow,
  title,
  body,
  mailtoSubject,
  primaryHref = "/",
  primaryLabel = site.ui.homeLink,
  emailPrompt = site.ui.contactPrompt,
  highlights,
  stamp,
}: HoldingCardProps) {
  const paragraphs = typeof body === "string" ? [body] : body;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(mailtoSubject)}`;

  return (
    <main className={styles.viewport}>
      <div className={styles.center}>
        <article className={`${styles.card} favo-rise`}>
          <p className={styles.wordmark}>
            <HexText
              text={site.ui.wordmark}
              hexClassName={styles.hex}
              plain="FavoDigital"
            />
          </p>

          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>

          {paragraphs.map((paragraph, i) => (
            <p key={i} className={styles.body}>
              {paragraph}
            </p>
          ))}

          {highlights && highlights.length > 0 ? (
            <section className={styles.highlights} aria-label="What FavoDigital does">
              <h2 className="sr-only">What we do</h2>
              <ul className={styles.svcList}>
                {highlights.map((item) => (
                  <li key={item.title} className={styles.svcItem}>
                    <h3 className={styles.svcKicker}>{item.title}</h3>
                    <p className={styles.svcBlurb}>{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className={styles.actions}>
            <Link href={primaryHref} className={styles.primary}>
              {primaryLabel}
            </Link>
            <p className={styles.contact}>
              {emailPrompt} <a href={mailto}>{site.email}</a>
            </p>
          </div>

          {stamp ? <p className={styles.stamp}>{stamp}</p> : null}
        </article>
      </div>
    </main>
  );
}
