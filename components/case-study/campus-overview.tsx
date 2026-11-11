import type { ReactNode } from "react";
import styles from "./campus-overview.module.css";

export function CampusOverview({ children }: { children: ReactNode }) {
  return <div className={styles.column}>{children}</div>;
}
