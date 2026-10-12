import styles from "./status-tag.module.css";

const neutral = new Set(["concept", "sketch"]);

export function StatusTag({ status }: { status: string }) {
  const kind = neutral.has(status.toLowerCase()) ? "neutral" : "progress";
  return (
    <span className={`${styles.tag} ${styles[kind]} t-mono-tag`}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  );
}
