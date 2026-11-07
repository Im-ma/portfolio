"use client";

import { useSyncExternalStore } from "react";
import styles from "./prototype-flows.module.css";

function useReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export type PrototypeFlow = {
  label: string;
  caption: string;
  mp4: string;
  poster: string;
  width: number;
  height: number;
};

export function PrototypeFlows({ items }: { items: PrototypeFlow[] }) {
  const reduced = useReducedMotion();

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <figure key={item.mp4} className={styles.item}>
          <div className={styles.panel} style={{ aspectRatio: `${item.width} / ${item.height}` }}>
            <video
              className={styles.video}
              poster={item.poster}
              muted
              loop={!reduced}
              playsInline
              autoPlay={!reduced}
              controls={reduced}
              preload="metadata"
              aria-label={`${item.label}. ${item.caption}`}
            >
              <source src={item.mp4} type="video/mp4" />
            </video>
          </div>
          <figcaption className={styles.caption}>
            <span className={`${styles.label} t-mono-label`}>{item.label}</span>
            <span className="t-body-s">{item.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
