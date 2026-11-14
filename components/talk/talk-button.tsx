"use client";

import { site } from "@/lib/content";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./talk-button.module.css";
import { useTalk } from "./talk-provider";

const FOOTER_ZONE = 120;

export function TalkButton() {
  const { open, label, openTalk, closeTalk, buttonRef } = useTalk();
  const pathname = usePathname();
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const update = () => {
      const zoneTop = window.innerHeight - FOOTER_ZONE;
      const hit = [...document.querySelectorAll("footer")].some((node) => {
        if (node.closest("[data-talk-dialog]")) return false;
        const rect = node.getBoundingClientRect();
        return rect.bottom > zoneTop && rect.top < window.innerHeight - 8;
      });
      setOverFooter(hit);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const tucked = overFooter && !open;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.button} t-button-m`}
      onClick={() => (open ? closeTalk() : openTalk("talk:open"))}
      aria-expanded={open}
      data-talk-launcher=""
      data-tucked={tucked ? "true" : undefined}
      aria-hidden={tucked ? true : undefined}
      tabIndex={tucked ? -1 : undefined}
      aria-haspopup="dialog"
      aria-keyshortcuts="T"
    >
      {open ? (
        <span aria-hidden="true">×</span>
      ) : (
        <span className={styles.dot} aria-hidden="true" />
      )}
      <span className={styles.label}>{open ? site.talkButton.closeLabel : label}</span>
      <span className={`${styles.key} t-mono-tag`}>
        {open ? site.talkButton.closeHint : site.talkButton.shortcut}
      </span>
    </button>
  );
}
