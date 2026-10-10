"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import styles from "./flow-video.module.css";

export function FlowVideo({
  label,
  poster,
  mp4,
  webm,
  playLabel,
  caption,
}: {
  label: string;
  poster: string;
  mp4: string;
  webm: string;
  playLabel: string;
  caption: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const wantPlay = useRef(false);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduced = useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const reducedRef = useRef(reduced);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setArmed(true);
          if (!reducedRef.current && !userPaused.current) {
            videoRef.current?.play().catch(() => setPlaying(false));
          }
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!armed || userPaused.current) return;
    if (reduced && !wantPlay.current) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => setPlaying(false));
  }, [armed, reduced]);

  function toggle() {
    const video = videoRef.current;
    if (!armed || !video) {
      wantPlay.current = true;
      userPaused.current = false;
      setArmed(true);
      return;
    }
    if (video.paused) {
      userPaused.current = false;
      wantPlay.current = true;
      video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      wantPlay.current = false;
      video.pause();
    }
  }

  return (
    <figure className={styles.wrap}>
      <p className={`${styles.label} t-mono-label`}>{label}</p>
      <div className={styles.stage} ref={stageRef}>
        {armed ? (
          <video
            ref={videoRef}
            className={styles.video}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={webm} type="video/webm" />
            <source src={mp4} type="video/mp4" />
          </video>
        ) : (
          <Image src={poster} alt="" fill sizes="(max-width: 767px) calc(100vw - 48px), 1200px" />
        )}
        <button
          type="button"
          className={playing ? styles.pause : styles.pill}
          onClick={toggle}
          aria-label={playing ? "Pause" : playLabel}
        >
          <span className={styles.icon} aria-hidden="true">
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="1" y="1" width="3.5" height="10" fill="currentColor" />
                <rect x="7.5" y="1" width="3.5" height="10" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M3 1.5v9l7.5-4.5L3 1.5z" fill="currentColor" />
              </svg>
            )}
          </span>
          {playing ? "Pause" : playLabel}
        </button>
      </div>
      <figcaption className={`${styles.caption} t-body-s`}>{caption}</figcaption>
    </figure>
  );
}
