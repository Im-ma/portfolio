"use client";

import { lastFinePoint, useLivelyPointer } from "@/lib/lively-pointer";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import styles from "./cursor.module.css";

type Mode =
  | "default"
  | "link"
  | "view"
  | "play"
  | "grab"
  | "grabbing"
  | "ask"
  | "close"
  | "zoom"
  | "zoom-out"
  | "native";

const labels: Partial<Record<Mode, string>> = {
  view: "View",
  play: "Play",
  ask: "Ask",
  close: "Close",
  zoom: "Zoom",
  "zoom-out": "Zoom out",
};

const markedModes = new Set<Mode>([
  "view",
  "play",
  "link",
  "ask",
  "close",
  "zoom",
  "zoom-out",
  "default",
]);

function modeFrom(target: EventTarget | null, down: boolean, event?: PointerEvent): Mode {
  const el = target instanceof Element ? target : null;
  if (event) {
    const gutterX = window.innerWidth - document.documentElement.clientWidth;
    const gutterY = window.innerHeight - document.documentElement.clientHeight;
    if (gutterX > 2 && event.clientX >= document.documentElement.clientWidth) return "native";
    if (gutterY > 2 && event.clientY >= document.documentElement.clientHeight) return "native";
  }
  if (!el) return "default";
  if (el.closest("input, textarea, select, [contenteditable='true']")) return "native";
  const marked = el.closest<HTMLElement>("[data-cursor]");
  if (marked) {
    const value = marked.dataset.cursor;
    if (value === "grab") return down ? "grabbing" : "grab";
    if (value && markedModes.has(value as Mode)) return value as Mode;
    return "link";
  }
  if (el.closest("a, button, [role='button'], summary")) return "link";
  if (
    el.closest(
      "[data-ask-root] p, [data-ask-root] li, [data-ask-root] blockquote, [data-ask-root] h1, [data-ask-root] h2, [data-ask-root] h3",
    )
  ) {
    return "ask";
  }
  return "default";
}

function scaleFor(mode: Mode) {
  if (mode === "link") return 1.55;
  if (
    mode === "view" ||
    mode === "play" ||
    mode === "close" ||
    mode === "zoom" ||
    mode === "zoom-out"
  ) {
    return 1.7;
  }
  if (mode === "grab") return 1.2;
  if (mode === "grabbing") return 0.92;
  if (mode === "ask") return 1;
  return 1;
}

function subscribeHost() {
  return () => {};
}

function cursorHost() {
  return document.body;
}

function cursorHostServer(): HTMLElement | null {
  return null;
}

export function SiteCursor() {
  const lively = useLivelyPointer();
  const host = useSyncExternalStore(subscribeHost, cursorHost, cursorHostServer);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!lively || !host) return;
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !dot || !ring || !label) return;

    document.documentElement.dataset.fineCursor = "on";
    const start = lastFinePoint();
    const point = { x: start.x, y: start.y, dx: start.x, dy: start.y, rx: start.x, ry: start.y };
    let mode: Mode = "default";
    let down = false;
    let grabbing = false;
    let frame = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      point.dx += (point.x - point.dx) * 0.38;
      point.dy += (point.y - point.dy) * 0.38;
      point.rx += (point.x - point.rx) * 0.16;
      point.ry += (point.y - point.ry) * 0.16;
      const scale = mode === "ask" ? "scale(0.22, 1.35)" : `scale(${scaleFor(mode)})`;
      dot.style.transform = `translate3d(${point.dx}px, ${point.dy}px, 0)`;
      ring.style.transform = `translate3d(${point.rx}px, ${point.ry}px, 0) ${scale}`;
      frame = window.requestAnimationFrame(draw);
    };

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      root.dataset.mode = next;
      label.textContent = labels[next] ?? "";
    };

    const onMove = (event: PointerEvent) => {
      point.x = event.clientX;
      point.y = event.clientY;
      if (grabbing && down) {
        setMode("grabbing");
        return;
      }
      setMode(modeFrom(event.target, down, event));
    };
    const onDown = (event: PointerEvent) => {
      down = true;
      const next = modeFrom(event.target, true, event);
      grabbing = next === "grabbing";
      setMode(next);
    };
    const onUp = (event: PointerEvent) => {
      down = false;
      grabbing = false;
      setMode(modeFrom(event.target, false, event));
    };
    const onLeave = () => {
      root.dataset.hidden = "true";
    };
    const onEnter = () => {
      delete root.dataset.hidden;
    };

    frame = window.requestAnimationFrame(draw);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      delete document.documentElement.dataset.fineCursor;
    };
  }, [host, lively]);

  if (!host) return null;

  return createPortal(
    <div ref={rootRef} className={styles.root} data-mode="default" aria-hidden="true">
      <span ref={dotRef} className={styles.dot} />
      <span ref={ringRef} className={styles.ring}>
        <svg className={styles.hand} viewBox="0 0 24 24">
          <path
            className={styles.handOpen}
            d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11M11 10.5V5.5a1.5 1.5 0 0 1 3 0V11M14 11V7.2a1.5 1.5 0 0 1 3 0V13c0 3.2-1.6 6-5.2 6H11c-2.4 0-4-1.2-4.8-3.1L4.6 12a1.4 1.4 0 0 1 2.4-1.4L8 12.2"
          />
          <path
            className={styles.handClosed}
            d="M8.2 11.2c.2-1.6 1.2-2.4 2-2.4.7 0 1.2.5 1.4 1.2.3-.8 1-1.3 1.8-1.3.8 0 1.4.6 1.6 1.3.4-.6 1-1 1.7-1 1.1 0 1.9.9 1.9 2.1v2.4c0 2.8-1.5 4.9-4.6 4.9h-1c-2.1 0-3.5-1.1-4.2-2.8l-.8-1.8a1.5 1.5 0 0 1 2.2-1.6z"
          />
        </svg>
        <span ref={labelRef} className={`${styles.label} t-mono-tag`} />
      </span>
    </div>,
    host,
  );
}
