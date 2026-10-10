"use client";

import { site } from "@/lib/content";
import styles from "./talk-button.module.css";
import { useTalk } from "./talk-provider";

export function TalkButton() {
  const { open, label, openTalk, closeTalk, buttonRef } = useTalk();
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.button} t-button-m`}
      onClick={() => (open ? closeTalk() : openTalk("talk:open"))}
      aria-expanded={open}
      data-talk-launcher=""
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
