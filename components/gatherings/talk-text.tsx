"use client";

import { useTalk } from "@/components/talk/talk-provider";
import styles from "./gatherings.module.css";

export function TalkText({ action, children }: { action: string; children: React.ReactNode }) {
  const { openTalk } = useTalk();
  return (
    <button type="button" className={`${styles.join} t-body-nav`} onClick={() => openTalk(action)}>
      {children} <span aria-hidden="true">→</span>
    </button>
  );
}
