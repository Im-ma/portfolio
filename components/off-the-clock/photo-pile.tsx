"use client";

import { useFreeArrange, type Piece } from "@/components/arrange/use-free-arrange";
import type { ClockItem } from "@/lib/off-the-clock";
import { layoutPile } from "@/lib/pile-layout";
import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import styles from "./off-the-clock.module.css";

const NO_HEIGHTS: Record<string, number> = {};

function freshSeed() {
  return 1 + Math.floor(Math.random() * 1_000_000_000);
}

function usePileSeed() {
  const store = useRef<{ seed: number; listeners: Set<() => void> } | null>(null);
  if (store.current === null) store.current = { seed: 0, listeners: new Set() };
  const current = store.current;
  const seed = useSyncExternalStore(
    (onChange) => {
      current.listeners.add(onChange);
      return () => current.listeners.delete(onChange);
    },
    () => {
      if (current.seed === 0) current.seed = freshSeed();
      return current.seed;
    },
    () => 0,
  );
  function reshuffle() {
    current.seed = freshSeed();
    current.listeners.forEach((listener) => listener());
  }
  return [seed, reshuffle] as const;
}

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 1.5v9l8-4.5z" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

function PileVideo({ src, poster, play }: { src: string; poster: string; play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (!play) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);
  }, [play]);

  return (
    <video
      ref={ref}
      className={styles.video}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}

function CardPhoto({ item, reduced }: { item: ClockItem; reduced: boolean }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = boxRef.current;
    if (!node || !item.video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) setArmed(true);
      },
      { threshold: 0.4, rootMargin: "160px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [item.video]);

  const play = Boolean(item.video) && inView && (!reduced || started);

  return (
    <span
      ref={boxRef}
      className={`${styles.photo} ${item.fit === "contain" ? styles.contain : ""}`}
    >
      <Image
        src={item.src}
        alt={item.video ? "" : item.caption}
        fill
        sizes="(max-width: 679px) 46vw, 280px"
        draggable={false}
        style={{ objectFit: item.fit, objectPosition: item.position }}
      />
      {item.video && (armed || started) ? (
        <PileVideo src={item.video} poster={item.src} play={play} />
      ) : null}
      {item.video ? (
        reduced && !started ? (
          <button
            type="button"
            className={styles.play}
            aria-label={`Play ${item.caption}`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setStarted(true)}
          >
            <PlayIcon />
          </button>
        ) : (
          <span className={styles.play} aria-hidden="true">
            <PlayIcon />
          </span>
        )
      ) : null}
    </span>
  );
}

export function PhotoPile({ items }: { items: ClockItem[] }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const tossTimer = useRef(0);
  const reduced = useReducedMotion();
  const [seed, reshuffle] = usePileSeed();
  const [width, setWidth] = useState(0);
  const [tossing, setTossing] = useState(false);
  const [measured, setMeasured] = useState<{ width: number; heights: Record<string, number> }>({
    width: 0,
    heights: NO_HEIGHTS,
  });
  const heights = measured.width === width ? measured.heights : NO_HEIGHTS;

  const layout = useMemo(() => {
    if (!width || seed === 0) return null;
    return layoutPile(
      items.map((item) => ({ id: item.id, shape: item.shape, caption: item.caption })),
      width,
      seed,
      heights,
    );
  }, [items, width, seed, heights]);

  const defaults = useMemo<Piece[]>(
    () =>
      (layout?.pieces ?? []).map((piece) => ({
        id: piece.id,
        x: piece.x,
        y: piece.y,
        w: piece.w,
        h: piece.h,
        rotation: piece.rotation,
      })),
    [layout],
  );
  const spinById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const piece of layout?.pieces ?? []) map[piece.id] = piece.spin;
    return map;
  }, [layout]);
  const visibleIds = useMemo(() => defaults.map((piece) => piece.id), [defaults]);
  const design = layout?.design ?? { width: Math.max(width, 1), height: 640 };

  const arrange = useFreeArrange({
    canvasRef,
    storageKey: `im-arrange:off-the-clock:${seed}:${width}`,
    design,
    defaults,
    visibleIds,
    layout: "saved",
    scatterSeed: 0,
    scale: "readable",
  });

  useLayoutEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const rounded = Math.round(entry?.contentRect.width ?? 0);
      setWidth((current) => (Math.abs(current - rounded) < 2 ? current : rounded));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !width || seed === 0) return;
    const read = () => {
      const next: Record<string, number> = {};
      canvas.querySelectorAll<HTMLElement>("[data-arrange-id]").forEach((node) => {
        const id = node.dataset.arrangeId;
        if (!id) return;
        next[id] = node.offsetHeight;
      });
      const ids = Object.keys(next);
      if (ids.length === 0) return;
      setMeasured((current) => {
        const same =
          current.width === width &&
          ids.length === Object.keys(current.heights).length &&
          ids.every((id) => Math.abs((current.heights[id] ?? 0) - (next[id] ?? 0)) < 2);
        return same ? current : { width, heights: next };
      });
    };
    const observer = new ResizeObserver(() => read());
    canvas.querySelectorAll<HTMLElement>("[data-arrange-id]").forEach((node) => {
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [width, seed, defaults]);

  useEffect(() => {
    const root = document.documentElement;
    const markPointer = () => {
      root.dataset.focus = "pointer";
    };
    const markKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab") root.dataset.focus = "keyboard";
    };
    let scrollTimer = 0;
    const onScroll = () => {
      root.dataset.scrolling = "true";
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        delete root.dataset.scrolling;
      }, 140);
    };
    window.addEventListener("pointerdown", markPointer, true);
    window.addEventListener("keydown", markKeyboard, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", markPointer, true);
      window.removeEventListener("keydown", markKeyboard, true);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(tossTimer.current);
      delete root.dataset.scrolling;
    };
  }, []);

  function shuffle() {
    if (reduced) {
      setTossing(false);
      reshuffle();
      return;
    }
    arrange.animate(() => {
      reshuffle();
      setTossing(true);
    });
    window.clearTimeout(tossTimer.current);
    tossTimer.current = window.setTimeout(() => setTossing(false), 780);
  }

  return (
    <>
      <div className={styles.toolbar}>
        <p className={`${styles.hint} t-mono-small`}>Hold, then drag.</p>
        <button type="button" className={`${styles.shuffle} t-body-nav`} onClick={shuffle}>
          <ShuffleIcon />
          Shuffle
        </button>
      </div>
      <div
        ref={canvasRef}
        className={`${styles.pile} ${arrange.canvasClass}${tossing ? ` ${styles.tossing}` : ""}`}
        style={arrange.canvasStyle}
        data-tossing={tossing ? "true" : undefined}
        role="group"
        aria-label="A pile of photos"
      >
        {items.map((item) => {
          const bound = arrange.bind(item.id);
          if (!bound.style) return null;
          return (
            <article
              key={item.id}
              {...bound}
              className={`${styles.card} ${bound.className ?? ""}`}
              style={{ ...bound.style, ["--spin" as string]: `${spinById[item.id] ?? 8}deg` }}
              data-shape={item.shape}
              data-fit={item.fit}
              tabIndex={0}
            >
              <CardPhoto item={item} reduced={reduced} />
              {item.video ? <span className="sr-only">Video. </span> : null}
              <span className={styles.caption}>{item.caption}</span>
            </article>
          );
        })}
      </div>
      <p className="sr-only">Arrow keys nudge a focused photo. Shift moves it farther.</p>
    </>
  );
}
