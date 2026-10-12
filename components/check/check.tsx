import { showChecks } from "@/lib/show-checks";
import styles from "./check.module.css";

export function Check({ note, onAccent = false }: { note?: string; onAccent?: boolean }) {
  if (!showChecks()) return null;
  return (
    <span className={styles.check} data-on-accent={onAccent ? "true" : undefined} title={note}>
      CHECK
    </span>
  );
}
