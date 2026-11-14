"use client";

import { useId } from "react";
import { Clasp } from "./clasp";
import styles from "./lanyard.module.css";

/* Strap and the front half of the clasp. The header paints this above its
   white bar and under the name, from the top edge of the page. */
export function LanyardStrap() {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`${styles.metrics} ${styles.headerRig}`} data-lanyard-header>
      <div className={styles.spin} data-lanyard-spin>
        <div className={styles.strap} />
        <div className={`${styles.clasp} ${styles.claspFront}`}>
          <Clasp id={`${id}-front`} />
        </div>
      </div>
    </div>
  );
}
