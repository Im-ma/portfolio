"use client";

import { useEffect, useState } from "react";
import styles from "./linked-frames.module.css";

function useActiveSection(ids: string[]) {
  const key = ids.join("|");
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    let frame = 0;
    const update = () => {
      frame = 0;
      const nodes = list
        .map((id) => document.getElementById(id))
        .filter((node): node is HTMLElement => Boolean(node));
      if (nodes.length === 0) return;
      const line = window.innerHeight * 0.32;
      let current = nodes[0];
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node;
      }
      setActive((previous) => (previous === current.id ? previous : current.id));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}

export function StudyNav({ items }: { items: { id: string; label: string }[] }) {
  const active = useActiveSection(items.map((item) => item.id));
  return (
    <nav className={styles.nav} aria-label="Sections">
      <ol className={styles.navList}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={styles.navLink}
              href={`#${item.id}`}
              data-active={item.id === active ? "true" : undefined}
              aria-current={item.id === active ? "location" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
