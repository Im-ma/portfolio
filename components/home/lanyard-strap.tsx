"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./lanyard.module.css";

/* Drawn inside the header, above its white bar and under the links.
   --shift keeps the strap pinned to the top of the page while the bar sticks. */
export function LanyardStrap() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      node.style.setProperty("--shift", `${-window.scrollY}px`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div ref={ref} className={styles.strap} aria-hidden="true" />;
}
