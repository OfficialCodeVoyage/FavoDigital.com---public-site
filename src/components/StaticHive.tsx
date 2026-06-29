import styles from "./StaticHive.module.css";

/**
 * Static honeycomb backdrop — the home hero's resting cells, frozen.
 *
 * Reuses the exact dormant-cell look from `HoneycombField` (clip-path hex, warm top
 * sheen, floor shadow, amber edge) but with NO JavaScript, NO animation and NO
 * interactivity — purely decorative. Sits fixed behind the HoldingCard content on
 * the 404 + landing pages. Marked aria-hidden; cells are inert spans.
 */
const ROWS = 18;
const COLS = 22;

export function StaticHive() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.field}>
        {Array.from({ length: ROWS }).map((_, r) => (
          <div
            key={r}
            className={r % 2 === 1 ? `${styles.row} ${styles.odd}` : styles.row}
          >
            {Array.from({ length: COLS }).map((_, c) => (
              <span key={c} className={styles.cell} />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.glow} />
    </div>
  );
}
