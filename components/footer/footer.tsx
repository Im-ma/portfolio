"use client";

import { Check } from "@/components/check/check";
import { site } from "@/lib/content";
import { useTalk } from "@/components/talk/talk-provider";
import styles from "./footer.module.css";

const linkByLabel = new Map(site.contactLinks.map((link) => [link.label, link]));

const compact = [
  ...site.footer.compactLinks.map((label) => {
    const match =
      label === "Resume"
        ? site.contactLinks.find((link) => link.label.startsWith("Resume"))
        : linkByLabel.get(label);
    return {
      label,
      href: match?.href ?? "#",
      check: match?.check,
      checkNote: match?.checkNote,
      external: Boolean(match?.href?.startsWith("http")),
    };
  }),
  {
    label: "Lab",
    href: "/lab",
    check: true,
    checkNote: "Lab link in the footer",
    external: false,
  },
];

export function Footer() {
  const { openTalk } = useTalk();
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.row}`}>
        <ul className={styles.links}>
          {compact.map((link) => (
            <li key={link.label}>
              {link.href === "talk:book" ? (
                <button
                  type="button"
                  className={`${styles.book} t-mono-small`}
                  onClick={() => openTalk("talk:book")}
                >
                  {link.label}
                  {link.check ? <Check note={link.checkNote} /> : null}
                </button>
              ) : (
                <a
                  className="t-mono-small"
                  href={link.href}
                  target={link.external || link.href.endsWith(".pdf") ? "_blank" : undefined}
                  rel={
                    link.external || link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined
                  }
                >
                  {link.label}
                  {link.check ? <Check note={link.checkNote} /> : null}
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className={`${styles.meta} t-mono-small`}>
          <span className={styles.hint}>Press T to talk</span>
          {site.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
