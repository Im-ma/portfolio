"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ScreenRect } from "@/lib/work-types";
import { PhoneFrame } from "@/components/phone/phone-frame";
import cropStyles from "@/components/phone/screen-crop.module.css";
import styles from "./phone-flows.module.css";

const wellRatio = 393 / 852;

export type PhoneFlowStep = {
  title: string;
  text: string;
  mp4: string;
  poster: string;
  width: number;
  height: number;
  screen: ScreenRect;
};

function useReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function PhoneFlows({ steps }: { steps: PhoneFlowStep[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const onScreen = useRef(false);
  const active = steps[index] ?? steps[0];

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = Boolean(entry?.isIntersecting);
        const video = videos.current[index];
        if (!video) return;
        if (entry?.isIntersecting && !reduced) {
          video.muted = true;
          video.play().catch(() => setPlaying(false));
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [index, reduced]);

  useEffect(() => {
    videos.current.forEach((video, item) => {
      if (!video) return;
      video.muted = true;
      if (item === index && onScreen.current && !reduced) {
        video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    });
  }, [index, reduced]);

  function toggle() {
    const video = videos.current[index];
    if (!video) return;
    if (video.paused) {
      video.muted = true;
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }

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
      <div className={styles.stage} ref={frameRef}>
        <PhoneFrame label={active.title}>
          <div
            className={styles.stack}
            id="flow-screen"
            role="tabpanel"
            aria-labelledby={`flow-tab-${index}`}
          >
            {steps.map((step, item) => {
              const wide = step.screen.w / step.screen.h > wellRatio;
              return (
                <div
                  key={step.title}
                  className={styles.layer}
                  data-active={item === index ? "true" : "false"}
                  aria-hidden={item === index ? undefined : true}
                >
                  <div
                    className={cropStyles.crop}
                    data-wide={wide ? "true" : "false"}
                    style={{ aspectRatio: `${step.screen.w} / ${step.screen.h}` }}
                  >
                    <video
                      ref={(node) => {
                        videos.current[item] = node;
                      }}
                      className={styles.video}
                      poster={step.poster}
                      muted
                      loop
                      playsInline
                      preload={item === index ? "metadata" : "none"}
                      aria-label={step.title}
                      onPlay={() => {
                        if (item === index) setPlaying(true);
                      }}
                      onPause={() => {
                        if (item === index) setPlaying(false);
                      }}
                      style={{
                        marginLeft: `${(-step.screen.x / step.screen.w) * 100}%`,
                        marginTop: `${(-step.screen.y / step.screen.w) * 100}%`,
                        width: `${(step.width / step.screen.w) * 100}%`,
                      }}
                    >
                      <source src={step.mp4} type="video/mp4" />
                    </video>
                  </div>
                </div>
              );
            })}
          </div>
        </PhoneFrame>
        <button type="button" className={`${styles.play} t-mono-tag`} onClick={toggle}>
          {playing ? "Pause" : "Play"}
        </button>
        <div className={styles.caption}>
          <h3 className="t-heading-h4">{active.title}</h3>
          <p className="t-body-m">{active.text}</p>
        </div>
      </div>
    </div>
  );
}
