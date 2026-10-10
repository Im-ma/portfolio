"use client";

import { useSyncExternalStore } from "react";

export function livelyPointer() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function subscribe(onChange: () => void) {
  const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  hover.addEventListener("change", onChange);
  reduce.addEventListener("change", onChange);
  return () => {
    hover.removeEventListener("change", onChange);
    reduce.removeEventListener("change", onChange);
  };
}

export function useLivelyPointer() {
  return useSyncExternalStore(subscribe, livelyPointer, () => false);
}
