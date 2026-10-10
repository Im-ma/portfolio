"use client";

import { useSyncExternalStore } from "react";

let seenFine = false;
const last = { x: -100, y: -100 };
const listeners = new Set<() => void>();

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function coarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function fineMedia() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function livelyPointer() {
  if (reducedMotion() || coarsePointer()) return false;
  return fineMedia() || seenFine;
}

export function lastFinePoint() {
  return last;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const onMedia = () => onChange();
  reduce.addEventListener("change", onMedia);
  coarse.addEventListener("change", onMedia);
  fine.addEventListener("change", onMedia);
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    last.x = event.clientX;
    last.y = event.clientY;
    if (seenFine || reducedMotion() || coarsePointer()) return;
    seenFine = true;
    emit();
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  return () => {
    listeners.delete(onChange);
    reduce.removeEventListener("change", onMedia);
    coarse.removeEventListener("change", onMedia);
    fine.removeEventListener("change", onMedia);
    window.removeEventListener("pointermove", onPointer);
  };
}

export function useLivelyPointer() {
  return useSyncExternalStore(subscribe, livelyPointer, () => false);
}
