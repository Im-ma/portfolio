import styles from "./phone-frame.module.css";

/**
 * Original iPhone 16 Pro style frame drawn for this site.
 * Proportions follow the published 402 by 874 pt screen, an even bezel,
 * and a centered Dynamic Island. This is not Apple artwork and not a
 * third party asset, so no separate license applies.
 */
export function PhoneFrame({
  children,
  label,
  maxWidth = 280,
}: {
  children: React.ReactNode;
  label: string;
  maxWidth?: number;
}) {
  return (
    <div
      className={styles.device}
      style={{ "--phone-max": `${maxWidth}px` } as React.CSSProperties}
    >
      <div className={styles.body}>
        <span className={styles.grain} aria-hidden="true" />
        <span className={styles.btn} data-side="left" data-kind="action" aria-hidden="true" />
        <span className={styles.btn} data-side="left" data-kind="volUp" aria-hidden="true" />
        <span className={styles.btn} data-side="left" data-kind="volDown" aria-hidden="true" />
        <span className={styles.btn} data-side="right" data-kind="power" aria-hidden="true" />
        <div className={styles.screen}>
          <div className={styles.well}>{children}</div>
          <span className={styles.island} aria-hidden="true">
            <span className={styles.lens} />
          </span>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
