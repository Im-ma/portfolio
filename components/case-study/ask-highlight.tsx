"use client";

import { Check } from "@/components/check/check";
import { useTalk } from "@/components/talk/talk-provider";
import styles from "./case-study.module.css";

export function AskHighlight({
  text,
  tooltip,
  source,
  check,
  checkNote,
}: {
  text: string;
  tooltip: string;
  source: string;
  check?: boolean;
  checkNote?: string;
}) {
  const { openTalk } = useTalk();
  return (
    <p className={`${styles.ask} t-body-m`}>
      <span className={styles.mark}>{text}</span>
      <button
        type="button"
        className={`${styles.demoTip} t-button-m`}
        onClick={() => openTalk("talk:question", { quote: text, source })}
      >
        <span className={styles.demoDot} aria-hidden="true" />
        {tooltip}
        <span className={`${styles.demoKey} t-mono-tag`}>T</span>
      </button>
      {check ? <Check note={checkNote} /> : null}
    </p>
  );
}
