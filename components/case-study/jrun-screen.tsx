"use client";

import { useSyncExternalStore } from "react";
import local from "./jrun-study.module.css";

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

export function DeviceClip({ mp4, poster, alt }: { mp4: string; poster: string; alt: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    // Poster only, when motion is reduced. Same pattern as the study video.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={local.screenMedia} src={poster} alt={alt} />;
  }
  return (
    <video
      className={local.screenMedia}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      aria-label={alt}
    >
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
