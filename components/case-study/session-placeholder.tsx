"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./session-placeholder.module.css";

export type SessionVideoSource = {
  mp4: string;
  webm: string;
  poster: string;
};

function subscribeReduced(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function SessionPlaceholder({
  video,
  label = "Session video coming soon",
}: {
  video?: SessionVideoSource;
  label?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playing = useRef(false);
  const [near, setNear] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    const node = frameRef.current;
    if (!node || !video || reduced) return;
    const visible = () => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight + 120;
    };
    if (visible()) setNear(true);
    const load = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: "120px" },
    );
    const play = new IntersectionObserver(([entry]) => {
      const onScreen = Boolean(entry?.isIntersecting);
      playing.current = onScreen;
      const clip = videoRef.current;
      if (!clip) return;
      if (onScreen) clip.play().catch(() => undefined);
      else clip.pause();
    });
    load.observe(node);
    play.observe(node);
    return () => {
      load.disconnect();
      play.disconnect();
    };
  }, [reduced, video]);

  useEffect(() => {
    const clip = videoRef.current;
    if (!clip || reduced || !near) return;
    clip.muted = true;
    if (playing.current) clip.play().catch(() => undefined);
    else clip.pause();
  }, [near, reduced]);

  return (
    <div ref={frameRef} className={styles.box} data-video={video ? "true" : undefined}>
      {video ? (
        <Image
          src={video.poster}
          alt={reduced ? label : ""}
          fill
          sizes="(max-width: 767px) 50vw, 25vw"
          style={{ objectFit: "contain" }}
        />
      ) : null}
      {video && !reduced && near ? (
        <video
          ref={videoRef}
          className={styles.media}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-label={label}
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </video>
      ) : null}
      {video ? null : <p className={`${styles.label} t-body-s`}>{label}</p>}
    </div>
  );
}
