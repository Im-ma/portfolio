"use client";

import { useState } from "react";
import Image from "next/image";
import { PhoneFrame } from "@/components/phone/phone-frame";
import styles from "./phone-flows.module.css";

export type PhoneFlowStep = {
  title: string;
  text: string;
  src: string;
  width: number;
  height: number;
};

export function PhoneFlows({ steps }: { steps: PhoneFlowStep[] }) {
  const [index, setIndex] = useState(0);
  const active = steps[index] ?? steps[0];

  function onKey(event: React.KeyboardEvent) {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    setIndex((current) => (current + delta + steps.length) % steps.length);
  }

  if (!active) return null;

  return (
    <div className={styles.layout}>
      <div className={styles.steps} role="tablist" aria-label="Core flows" onKeyDown={onKey}>
        {steps.map((step, item) => {
          const selected = item === index;
          return (
            <button
              key={step.title}
              type="button"
              className={styles.step}
              role="tab"
              id={`flow-tab-${item}`}
              aria-selected={selected}
              aria-controls="flow-screen"
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(item)}
            >
              <span className={`${styles.num} t-mono-number`}>
                {String(item + 1).padStart(2, "0")}
              </span>
              <span className="t-body-s">{step.title}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.stage}>
        <PhoneFrame label={active.title}>
          <div
            className={styles.stack}
            id="flow-screen"
            role="tabpanel"
            aria-labelledby={`flow-tab-${index}`}
          >
            {steps.map((step, item) => (
              <div
                key={step.src}
                className={styles.layer}
                data-active={item === index ? "true" : "false"}
                aria-hidden={item === index ? undefined : true}
              >
                <Image
                  src={step.src}
                  alt=""
                  fill
                  sizes="280px"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            ))}
          </div>
        </PhoneFrame>
        <div className={styles.caption}>
          <h3 className="t-heading-h4">{active.title}</h3>
          <p className="t-body-m">{active.text}</p>
        </div>
      </div>
    </div>
  );
}
