"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./linked-frames.module.css";

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

export function StudyVideo({
  mp4,
  poster,
  width,
  height,
  alt,
  eager = false,
  cover = false,
}: {
  mp4: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
  eager?: boolean;
  cover?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [near, setNear] = useState(eager);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = stageRef.current;
    if (!node || eager) return;
    const load = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: "400px" },
    );
    load.observe(node);
    return () => load.disconnect();
  }, [eager]);

  const showVideo = near && (!reduced || started);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;
    video.muted = true;
    if (reduced) {
      if (started && !userPaused.current) video.play().catch(() => setPlaying(false));
      return;
    }
    const play = new IntersectionObserver(
      ([entry]) => {
        const onScreen = Boolean(entry?.isIntersecting);
        if (!onScreen) {
          video.pause();
          return;
        }
        if (!userPaused.current) video.play().catch(() => setPlaying(false));
      },
      { threshold: 0.2 },
    );
    play.observe(video);
    return () => play.disconnect();
  }, [showVideo, reduced, started]);

  function toggle() {
    if (reduced && !started) {
      userPaused.current = false;
      setStarted(true);
      return;
    }
    const video = videoRef.current;
    if (!video) {
      setStarted(true);
      return;
    }
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  function replay() {
    userPaused.current = false;
    if (reduced && !started) {
      setStarted(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => setPlaying(false));
  }

  return (
    <div
      ref={stageRef}
      className={cover ? `${styles.stage} ${styles.coverStage}` : styles.stage}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Poster stays up until the loop is ready. Below-fold clips wait to load. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.poster}
        src={poster}
        alt={showVideo ? "" : alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {showVideo ? (
        <video
          ref={videoRef}
          className={styles.videoEl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload={eager ? "auto" : "metadata"}
          aria-label={alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={mp4} type="video/mp4" />
        </video>
      ) : null}
      <div className={styles.controls} data-visible={playing ? undefined : "true"}>
        <button
          type="button"
          className={styles.control}
          aria-label={playing ? "Pause video" : "Play video"}
          onClick={toggle}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" className={styles.control} aria-label="Replay video" onClick={replay}>
          <ReplayIcon />
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z" />
    </svg>
  );
}
