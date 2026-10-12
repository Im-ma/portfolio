"use client";

import { home } from "@/lib/content";
import { useEffect, useRef } from "react";
import styles from "./signal-path.module.css";

export function SignalPath() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.classList.add(styles.draw);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className={styles.diagram} aria-hidden="true">
        <span className={styles.track} />
        {home.howIWork.steps.map((step, index) => (
          <span
            key={step.label}
            className={styles.node}
            style={{ left: `calc(${index} * ((100% - 48px) / 3 + 24px))` }}
          />
        ))}
        <span className={styles.end} />
      </div>
      <ol className={styles.steps}>
        {home.howIWork.steps.map((step) => (
          <li key={step.label} className={styles.step}>
            <p className={`${styles.label} t-mono-label`}>{step.label}</p>
            <h3 className="t-heading-h3">{step.title}</h3>
            <p className={`${styles.text} t-body-s`}>{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
