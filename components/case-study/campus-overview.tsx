import { Source_Serif_4 } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import styles from "./campus-overview.module.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

export function CampusOverview({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div
      className={styles.column}
      style={{ "--overview-serif": serif.style.fontFamily } as CSSProperties}
    >
      {label ? <p className={`${styles.label} t-body-s`}>{label}</p> : null}
      {children}
    </div>
  );
}
