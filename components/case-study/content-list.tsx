"use client";

import { Check } from "@/components/check/check";
import { itemView } from "@/lib/built-views";
import type { ListItem } from "@/lib/work-types";
import { useBuiltView } from "./built-toggle";
import styles from "./case-study.module.css";

export function ContentList({ variant, items }: { variant?: string; items: ListItem[] }) {
  const view = useBuiltView();
  const shown = items.filter((item) => {
    if (view === "all") return true;
    const bucket = itemView(item.title);
    return bucket === "shared" || bucket === view;
  });
  if (shown.length === 0) return null;
  const numbered = variant === "numbered";
  return (
    <ul className={styles.list}>
      {shown.map((item) => (
        <li key={`${item.marker}-${item.title ?? item.text}`} className={styles.row}>
          <span className={`${numbered ? styles.num : styles.arrow} t-mono-number`}>
            {item.marker}
          </span>
          <span>
            {item.title ? (
              <span className={`${styles.rowTitle} t-body-m-strong`}>{item.title}</span>
            ) : null}
            <span className={`${numbered ? styles.rowBody : styles.rowText} t-body-s`}>
              {item.text}
              {item.check ? <Check note={item.checkNote} /> : null}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
