"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/work-types";
import styles from "./case-study.module.css";

function useActiveSection(ids: string[]) {
  const key = ids.join("|");
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    const nodes = list
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) return;
        const next = [...visible.entries()].sort((a, b) => a[1] - b[1])[0]?.[0];
        if (next) setActive(next);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

function collectIds(items: TocItem[]) {
  return items.flatMap((item) => [item.anchor, ...(item.subs ?? []).map((sub) => sub.anchor)]);
}

export function CaseToc({
  label,
  items,
  note,
}: {
  label: string;
  items: TocItem[];
  note?: string;
}) {
  const active = useActiveSection(collectIds(items));
  return (
    <nav className={styles.toc} aria-label={label}>
      <p className={`${styles.tocLabel} t-mono-label`}>{label}</p>
      <ol className={styles.tocList}>
        {items.map((item) => {
          const childActive = item.subs?.some((sub) => sub.anchor === active) ?? false;
          const current = item.anchor === active || childActive;
          return (
            <li key={item.anchor}>
              <a
                className={`${styles.tocLink} t-body-xs`}
                href={`#${item.anchor}`}
                data-active={item.anchor === active ? "true" : undefined}
                data-current={current ? "true" : undefined}
                aria-current={item.anchor === active ? "location" : undefined}
              >
                <span className={`${styles.tocNum} t-mono-number`}>{item.number}</span>
                <span>{item.title}</span>
              </a>
              {item.subs && item.subs.length > 0 ? (
                <ol className={styles.subList}>
                  {item.subs.map((sub) => (
                    <li key={sub.anchor}>
                      <a
                        className={`${styles.subLink} t-body-xs`}
                        href={`#${sub.anchor}`}
                        data-active={sub.anchor === active ? "true" : undefined}
                        aria-current={sub.anchor === active ? "location" : undefined}
                      >
                        <span className={`${styles.tocNum} t-mono-small`}>{sub.number}</span>
                        <span>{sub.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ol>
      {note ? <p className={`${styles.devNote} t-mono-small`}>{note}</p> : null}
    </nav>
  );
}

export function CaseTocBar({ label, items }: { label: string; items: TocItem[] }) {
  const active = useActiveSection(collectIds(items));
  return (
    <div className={styles.tocBar} role="navigation" aria-label={label}>
      {items.map((item) => {
        const childActive = item.subs?.some((sub) => sub.anchor === active) ?? false;
        const on = item.anchor === active || childActive;
        return (
          <a
            key={item.anchor}
            className={`${styles.tocChip} t-body-xs`}
            href={`#${item.anchor}`}
            data-active={on ? "true" : undefined}
            aria-current={on ? "location" : undefined}
          >
            {item.number} {item.title}
          </a>
        );
      })}
    </div>
  );
}
