"use client";

import type { ReactNode } from "react";
import styles from "./trace-play.module.css";

export function TryIt({
  id,
  hint,
  onReset,
  children,
}: {
  id: string;
  hint: string;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <section className={styles.try} id={id} aria-label="Try it">
      <div className={styles.tryHead}>
        <p className={`${styles.tryMark} t-mono-label`}>Try it</p>
        <p className={`${styles.tryHint} t-body-s`}>{hint}</p>
        <button type="button" className={styles.reset} onClick={onReset}>
          Reset
        </button>
      </div>
      {children}
    </section>
  );
}
