import styles from "./phone-frame.module.css";

export function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className={styles.device}>
      <div className={styles.body}>
        <span className={styles.btn} data-side="left" data-kind="action" aria-hidden="true" />
        <span className={styles.btn} data-side="left" data-kind="vol1" aria-hidden="true" />
        <span className={styles.btn} data-side="left" data-kind="vol2" aria-hidden="true" />
        <span className={styles.btn} data-side="right" data-kind="power" aria-hidden="true" />
        <div className={styles.bezel}>
          <div className={styles.screen}>
            <span className={styles.island} aria-hidden="true" />
            <div className={styles.well}>{children}</div>
          </div>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
