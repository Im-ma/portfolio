"use client";

import { useEffect, useState } from "react";
import styles from "./ask-selection.module.css";
import { readAskSelection, useTalk } from "@/components/talk/talk-provider";

type Tip = { text: string; source: string; x: number; y: number };

export function AskSelection() {
  const { openTalk, open } = useTalk();
  const [tip, setTip] = useState<Tip | null>(null);
  const visible = open ? null : tip;

  useEffect(() => {
    const update = () => {
      const ask = readAskSelection();
      if (!ask) {
        setTip(null);
        return;
      }
      setTip({
        text: ask.text,
        source: ask.source,
        x: ask.rect.left + ask.rect.width / 2,
        y: ask.rect.top,
      });
    };
    document.addEventListener("mouseup", update);
    document.addEventListener("keyup", update);
    document.addEventListener("selectionchange", update);
    return () => {
      document.removeEventListener("mouseup", update);
      document.removeEventListener("keyup", update);
      document.removeEventListener("selectionchange", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={`${styles.tip} t-button-m`}
      style={{ left: visible.x, top: Math.max(visible.y, 56) }}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        openTalk("talk:question", { quote: visible.text, source: visible.source });
        setTip(null);
        window.getSelection()?.removeAllRanges();
      }}
    >
      <span className={styles.dot} aria-hidden="true" />
      Ask Immanuel about this
      <span className={`${styles.key} t-mono-tag`}>T</span>
    </button>
  );
}
