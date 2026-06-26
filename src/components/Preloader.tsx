import styles from "./Preloader.module.css";

/**
 * Branded loading screen. Stays mounted but hides itself (visibility + a11y) once
 * `hidden` flips true, so the hand-off into the hero entrance is one continuous
 * motion. On reduced motion the CSS hides the loader entirely (no gate).
 */
export function Preloader({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={styles.loader}
      data-hide={hidden}
      role="status"
      aria-label="Loading FavoDigital"
      aria-hidden={hidden}
    >
      <span className={styles.hex} aria-hidden="true" />
      <span className={styles.label} aria-hidden="true">
        FavoDigital
      </span>
    </div>
  );
}
