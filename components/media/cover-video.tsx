"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./cover-video.module.css";

function subscribeReduced(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function CoverVideo({
  mp4,
  webm,
  poster,
  field,
  eager = false,
  label,
}: {
  mp4: string;
  webm?: string;
  poster: string;
  field: string;
  eager?: boolean;
  label?: string;
}) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playing = useRef(false);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
    () => false,
  );

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const visible = () => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight + 200;
    };
    if (visible()) setNear(true);
    const load = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: "200px" },
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
    <span ref={frameRef} className={styles.frame} style={{ background: field }}>
      <Image
        src={poster}
        alt={label && reduced ? label : ""}
        fill
        sizes="100vw"
        loading={eager ? "eager" : undefined}
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
          poster={poster}
          aria-label={label}
          aria-hidden={label ? undefined : true}
          onCanPlay={() => setReady(true)}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          <source src={mp4} type="video/mp4" />
        </video>
      ) : null}
    </span>
  );
}
