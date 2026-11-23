"use client";

import { Reveal } from "@/components/motion/reveal";
import { PhoneFrame } from "@/components/phone/phone-frame";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
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
  frame?: "phone";
};

function useClipPlayback(reduced: boolean) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playing = useRef(false);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

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

  return { frameRef, videoRef, near, ready, setReady };
}

function ClipVideo({
  clip,
  videoRef,
  ready,
  onReady,
  className,
}: {
  clip: Clip;
  videoRef: RefObject<HTMLVideoElement | null>;
  ready: boolean;
  onReady: () => void;
  className: string;
}) {
  return (
    <video
      ref={videoRef}
      className={className}
      data-ready={ready ? "true" : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={clip.poster}
      aria-label={clip.label}
      onCanPlay={onReady}
    >
      <source src={clip.webm} type="video/webm" />
      <source src={clip.mp4} type="video/mp4" />
    </video>
  );
}

function FlowClip({ clip, sizes }: { clip: Clip; sizes: string }) {
  const reduced = useReducedMotion();
  const { frameRef, videoRef, near, ready, setReady } = useClipPlayback(reduced);

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
        <ClipVideo
          clip={clip}
          videoRef={videoRef}
          ready={ready}
          onReady={() => setReady(true)}
          className={styles.video}
        />
      ) : null}
    </span>
  );
}

function PhoneClip({ clip }: { clip: Clip }) {
  const reduced = useReducedMotion();
  const { frameRef, videoRef, near, ready, setReady } = useClipPlayback(reduced);

  return (
    <span ref={frameRef} className={styles.phoneSlot}>
      <PhoneFrame label={clip.label}>
        <span className={styles.screenFill}>
          <Image
            src={clip.poster}
            alt={reduced ? clip.label : ""}
            fill
            sizes="280px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
          {!reduced && near ? (
            <ClipVideo
              clip={clip}
              videoRef={videoRef}
              ready={ready}
              onReady={() => setReady(true)}
              className={styles.screenVideo}
            />
          ) : null}
        </span>
      </PhoneFrame>
    </span>
  );
}

function FlowBody({ clip }: { clip: Clip }) {
  return clip.frame === "phone" ? (
    <PhoneClip clip={clip} />
  ) : (
    <FlowClip clip={clip} sizes="(max-width: 767px) 100vw, 40vw" />
  );
}

export function CoreFlows({
  rows,
  onboarding,
  layout,
}: {
  rows: Clip[];
  onboarding: Clip;
  layout?: "columns";
}) {
  if (layout === "columns") {
    return (
      <div className={styles.grid}>
        {[...rows, onboarding].map((clip) => (
          <Reveal key={clip.title}>
            <article className={styles.card}>
              <FlowBody clip={clip} />
              <div className={styles.copy}>
                <h4 className="t-heading-h4">{clip.title}</h4>
                <p className="t-body-m">{clip.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.flows}>
      <div className={styles.rows}>
        {rows.map((row) => (
          <Reveal key={row.title}>
            <article className={styles.row}>
              {row.frame === "phone" ? (
                <PhoneClip clip={row} />
              ) : (
                <FlowClip clip={row} sizes="(max-width: 767px) 100vw, 60vw" />
              )}
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
          {onboarding.frame === "phone" ? (
            <PhoneClip clip={onboarding} />
          ) : (
            <FlowClip clip={onboarding} sizes="100vw" />
          )}
        </div>
      </Reveal>
    </div>
  );
}
