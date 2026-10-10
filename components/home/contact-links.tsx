"use client";

import { Check } from "@/components/check/check";
import { site } from "@/lib/content";
import { useTalk } from "@/components/talk/talk-provider";
import styles from "./home.module.css";

export function ContactLinks() {
  const { openTalk } = useTalk();
  return (
    <ul className={styles.links}>
      {site.contactLinks.map((link) => {
        const inner = (
          <>
            <span className={`${styles.rowNum} t-mono-number`}>{link.number}</span>
            <span className="t-body-nav">{link.label}</span>
            <span className={`${styles.rowValue} t-mono-small`}>
              {link.value} <span aria-hidden="true">→</span>
              {link.check ? <Check note={link.checkNote} /> : null}
            </span>
          </>
        );
        return (
          <li key={link.number}>
            {link.href === "talk:book" ? (
              <button type="button" className={styles.row} onClick={() => openTalk("talk:book")}>
                {inner}
              </button>
            ) : (
              <a
                className={styles.row}
                href={link.href}
                target={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http") || link.href.endsWith(".pdf")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
