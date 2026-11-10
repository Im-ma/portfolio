"use client";

import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./core-flows.module.css";

function subscribeReduced(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

type Clip = {
  title: string;
  text: string;
  label: string;
  mp4: string;
  webm: string;
  poster: string;
  width: number;
  height: number;
};

function FlowClip({ clip, sizes }: { clip: Clip; sizes: string }) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playing = useRef(false);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const visible = () => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight + 160;
    };
    if (visible()) setNear(true);
    const load = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: "160px" },
    );
    const play = new IntersectionObserver(([entry]) => {
      const onScreen = Boolean(entry?.isIntersecting);
      playing.current = onScreen;
      const video = videoRef.current;
      if (!video || reduced) return;
      if (onScreen) video.play().catch(() => undefined);
      else video.pause();
    });
    load.observe(node);
    play.observe(node);
    return () => {
      load.disconnect();
      play.disconnect();
    };
  }, [reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || !near) return;
    video.muted = true;
    if (playing.current) video.play().catch(() => undefined);
    else video.pause();
  }, [near, reduced]);

  return (
    <span
      ref={frameRef}
      className={styles.frame}
      style={{ aspectRatio: `${clip.width} / ${clip.height}` }}
    >
      <Image
        src={clip.poster}
        alt={reduced ? clip.label : ""}
        fill
        sizes={sizes}
        style={{ objectFit: "contain" }}
        loading="lazy"
      />
      {!reduced && near ? (
        <video
          ref={videoRef}
          className={styles.video}
          data-ready={ready ? "true" : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={clip.poster}
          aria-label={clip.label}
          onCanPlay={() => setReady(true)}
        >
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
      ) : null}
    </span>
  );
}

export function CoreFlows({ rows, onboarding }: { rows: Clip[]; onboarding: Clip }) {
  return (
    <div className={styles.flows}>
      <div className={styles.rows}>
        {rows.map((row) => (
          <Reveal key={row.title}>
            <article className={styles.row}>
              <FlowClip clip={row} sizes="(max-width: 767px) 100vw, 60vw" />
              <div className={styles.copy}>
                <h4 className="t-heading-h4">{row.title}</h4>
                <p className="t-body-m">{row.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className={styles.onboarding}>
          <h3 className="t-heading-h3">{onboarding.title}</h3>
          <p className="t-body-m">{onboarding.text}</p>
          <FlowClip clip={onboarding} sizes="100vw" />
        </div>
      </Reveal>
    </div>
  );
}
