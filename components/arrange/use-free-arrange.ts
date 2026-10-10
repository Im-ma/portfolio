"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import styles from "./arrange.module.css";

export type Piece = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
};

type Place = {
  x: number;
  y: number;
  rotation: number;
  z: number;
};

type MinSize = { width: number; height: number };

type Saved = Record<string, Place>;

const EMPTY: Saved = {};
const HOLD_MS = 460;
const DRAG_PX = 8;
const MAX_Y = 175;

type Bus = { loaded: boolean; saved: Saved; listeners: Set<() => void> };
const buses = new Map<string, Bus>();

function bus(key: string) {
  let entry = buses.get(key);
  if (!entry) {
    entry = { loaded: false, saved: EMPTY, listeners: new Set() };
    buses.set(key, entry);
  }
  return entry;
}

function isPlace(value: unknown): value is Place {
  if (!value || typeof value !== "object") return false;
  const place = value as Place;
  return [place.x, place.y, place.rotation, place.z].every(
    (item) => typeof item === "number" && Number.isFinite(item),
  );
}

function readSaved(key: string): Saved {
  const entry = bus(key);
  if (entry.loaded) return entry.saved;
  entry.loaded = true;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return EMPTY;
    const next: Saved = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (isPlace(value)) next[id] = value;
    }
    entry.saved = next;
    return next;
  } catch {
    return EMPTY;
  }
}

function writeSaved(key: string, saved: Saved) {
  const entry = bus(key);
  entry.loaded = true;
  entry.saved = saved;
  try {
    localStorage.setItem(key, JSON.stringify(saved));
  } catch {
    /* The arrangement still works for this visit if storage is full. */
  }
  entry.listeners.forEach((listener) => listener());
}

function useSaved(key: string) {
  return useSyncExternalStore(
    (onChange) => {
      const entry = bus(key);
      entry.listeners.add(onChange);
      return () => entry.listeners.delete(onChange);
    },
    () => readSaved(key),
    () => EMPTY,
  );
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function placeFrom(piece: Piece, z: number): Place {
  return { x: piece.x, y: piece.y, rotation: piece.rotation, z };
}

type Fitted = { widthPx: number; heightPx: number; wPct: number };

function fit(piece: Piece, canvasW: number, designH: number, minSize?: MinSize): Fitted {
  const naturalW = canvasW > 0 ? (piece.w / 100) * canvasW : 0;
  const naturalH = designH > 0 ? (piece.h / 100) * designH : 0;
  let scale = 1;
  if (minSize && naturalW > 0 && naturalH > 0) {
    scale = Math.max(scale, minSize.width / naturalW, minSize.height / naturalH);
    scale = Math.min(scale, Math.max(canvasW - 8, 1) / naturalW);
  }
  const widthPx = naturalW * scale;
  const heightPx = naturalH * scale;
  const wPct = canvasW > 0 ? (widthPx / canvasW) * 100 : piece.w;
  return { widthPx, heightPx, wPct };
}

function clamp(place: Place, wPct: number): Place {
  return {
    ...place,
    x: Math.min(Math.max(0, place.x), Math.max(0, 100 - wPct)),
    y: Math.min(Math.max(0, place.y), MAX_Y),
  };
}

export function scatterPieces(visible: Piece[], slots: Piece[], seed: number): Piece[] {
  const random = mulberry32(seed);
  return visible.map((piece, index) => {
    const slot = slots[index] ?? piece;
    const offsetX = (random() * 2 - 1) * 1.4;
    const offsetY = (random() * 2 - 1) * 1.6;
    const rotation = random() * 8 - 4;
    return {
      ...piece,
      x: slot.x + offsetX,
      y: slot.y + offsetY,
      w: slot.w,
      h: slot.h,
      rotation,
    };
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Drag = {
  id: string;
  pointerId: number;
  coarse: boolean;
  originX: number;
  originY: number;
  start: Place;
  lifted: boolean;
  node: HTMLElement;
};

export function useFreeArrange({
  canvasRef,
  storageKey,
  design,
  defaults,
  visibleIds,
  layout,
  scatterSeed,
  minSize,
}: {
  canvasRef: RefObject<HTMLDivElement | null>;
  storageKey: string;
  design: { width: number; height: number };
  defaults: Piece[];
  visibleIds: string[];
  layout: "saved" | "scatter";
  scatterSeed: number;
  minSize?: MinSize;
}) {
  const saved = useSaved(storageKey);
  const [overrides, setOverrides] = useState<{ seed: number; map: Record<string, Place> }>({
    seed: -1,
    map: {},
  });
  const [settling, setSettling] = useState(false);
  const [width, setWidth] = useState(0);
  const designRef = useRef(design);
  const defaultsRef = useRef(defaults);
  const layoutRef = useRef(layout);
  const seedRef = useRef(scatterSeed);
  const keyRef = useRef(storageKey);
  const minSizeRef = useRef(minSize);
  const viewRef = useRef<Record<string, Place>>({});
  const dragRef = useRef<Drag | null>(null);
  const holdRef = useRef(0);
  const skipClick = useRef(false);
  const tiltSeed = useRef(3);
  const settleTimer = useRef(0);

  const scattered = useMemo(() => {
    if (layout !== "scatter") return null;
    const visible = visibleIds
      .map((id) => defaults.find((piece) => piece.id === id))
      .filter((piece): piece is Piece => Boolean(piece));
    const slots = defaults.slice(0, visible.length);
    return scatterPieces(visible, slots, scatterSeed);
  }, [layout, visibleIds, defaults, scatterSeed]);

  const live = useMemo(() => {
    const map: Record<string, Place> = {};
    defaults.forEach((piece, index) => {
      if (layout === "scatter") {
        const edited = overrides.seed === scatterSeed ? overrides.map[piece.id] : undefined;
        const scatteredPiece = scattered?.find((item) => item.id === piece.id);
        const source =
          edited ?? (scatteredPiece ? placeFrom(scatteredPiece, index + 1) : undefined);
        if (source) map[piece.id] = source;
        return;
      }
      const stored = saved[piece.id];
      map[piece.id] = stored
        ? { ...placeFrom(piece, index + 1), ...stored }
        : placeFrom(piece, index + 1);
    });
    return map;
  }, [defaults, layout, overrides, scatterSeed, scattered, saved]);

  const designH = width > 0 ? (width * design.height) / design.width : 0;

  const view = useMemo(() => {
    const map: Record<string, Place> = {};
    for (const [id, place] of Object.entries(live)) {
      const piece = defaults.find((item) => item.id === id);
      if (!piece) continue;
      const fitted = fit(piece, width, designH, minSize);
      map[id] = clamp(place, width > 0 ? fitted.wPct : piece.w);
    }
    return map;
  }, [live, defaults, width, designH, minSize]);

  let need = designH;
  for (const id of visibleIds) {
    const piece = defaults.find((item) => item.id === id);
    const place = view[id];
    if (!piece || !place || !designH) continue;
    const fitted = fit(piece, width, designH, minSize);
    const top = (place.y / 100) * designH;
    need = Math.max(need, top + fitted.heightPx + 28);
  }

  useEffect(() => {
    designRef.current = design;
    defaultsRef.current = defaults;
    layoutRef.current = layout;
    seedRef.current = scatterSeed;
    keyRef.current = storageKey;
    minSizeRef.current = minSize;
    viewRef.current = view;
  }, [design, defaults, layout, scatterSeed, storageKey, minSize, view]);

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = entry?.contentRect.width ?? 0;
      setWidth((current) => (Math.abs(current - next) < 1 ? current : next));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [canvasRef]);

  useEffect(() => {
    return () => {
      window.clearTimeout(holdRef.current);
      window.clearTimeout(settleTimer.current);
    };
  }, []);

  function pieceById(id: string) {
    return defaultsRef.current.find((piece) => piece.id === id);
  }

  function metrics(piece: Piece) {
    const canvasW = canvasRef.current?.clientWidth ?? 0;
    const height = canvasW > 0 ? (canvasW * designRef.current.height) / designRef.current.width : 0;
    return { canvasW, height, fitted: fit(piece, canvasW, height, minSizeRef.current) };
  }

  function freshTilt() {
    tiltSeed.current += 1;
    const random = mulberry32(tiltSeed.current);
    const magnitude = 2 + random() * 3.5;
    return (random() > 0.5 ? 1 : -1) * magnitude;
  }

  function frontZ() {
    const values = Object.values(viewRef.current).map((place) => place.z);
    return Math.max(40, ...values) + 1;
  }

  function commit(id: string, place: Place) {
    const piece = pieceById(id);
    if (!piece) return;
    const { fitted } = metrics(piece);
    const next = clamp(place, fitted.wPct);
    viewRef.current = { ...viewRef.current, [id]: next };
    if (layoutRef.current === "scatter") {
      setOverrides((current) => ({
        seed: seedRef.current,
        map: { ...(current.seed === seedRef.current ? current.map : {}), [id]: next },
      }));
    }
    writeSaved(keyRef.current, { ...readSaved(keyRef.current), [id]: next });
  }

  function lift(drag: Drag) {
    if (drag.lifted) return;
    drag.lifted = true;
    skipClick.current = true;
    const z = frontZ();
    drag.start = { ...drag.start, z };
    drag.node.classList.add(styles.lifted);
    drag.node.style.zIndex = String(z);
    drag.node.style.touchAction = "none";
    canvasRef.current?.setAttribute("data-dragging", "true");
    try {
      drag.node.setPointerCapture(drag.pointerId);
    } catch {
      /* Capture can fail if the pointer already ended. */
    }
  }

  function moveDrag(drag: Drag, clientX: number, clientY: number) {
    const piece = pieceById(drag.id);
    if (!piece) return;
    const { canvasW, height, fitted } = metrics(piece);
    if (canvasW < 1 || height < 1) return;
    const dx = ((clientX - drag.originX) / canvasW) * 100;
    const dy = ((clientY - drag.originY) / height) * 100;
    const next = clamp({ ...drag.start, x: drag.start.x + dx, y: drag.start.y + dy }, fitted.wPct);
    drag.node.style.left = `${next.x}%`;
    drag.node.style.top = `${(next.y / 100) * height}px`;
    drag.node.style.zIndex = String(drag.start.z);
    drag.start = { ...next, z: drag.start.z };
    drag.originX = clientX;
    drag.originY = clientY;
  }

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const distance = Math.hypot(event.clientX - drag.originX, event.clientY - drag.originY);
      if (!drag.lifted) {
        if (distance < DRAG_PX) return;
        if (drag.coarse) {
          window.clearTimeout(holdRef.current);
          dragRef.current = null;
          skipClick.current = true;
          return;
        }
        lift(drag);
      }
      if (drag.lifted) event.preventDefault();
      moveDrag(drag, event.clientX, event.clientY);
    };
    const finish = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      window.clearTimeout(holdRef.current);
      dragRef.current = null;
      canvasRef.current?.removeAttribute("data-dragging");
      drag.node.style.touchAction = "";
      if (!drag.lifted) {
        if (skipClick.current) {
          window.setTimeout(() => {
            skipClick.current = false;
          }, 80);
        }
        return;
      }
      const place = { ...drag.start, rotation: freshTilt(), z: drag.start.z };
      drag.node.style.setProperty("--rot", `${place.rotation}deg`);
      drag.node.classList.remove(styles.lifted);
      commit(drag.id, place);
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
    // Handlers read the latest pieces, layout, and storage key through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function settle(apply: () => void) {
    window.clearTimeout(settleTimer.current);
    if (prefersReducedMotion()) {
      setSettling(false);
      apply();
      return;
    }
    setSettling(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        apply();
        settleTimer.current = window.setTimeout(() => setSettling(false), 520);
      });
    });
  }

  function tidy(extra?: () => void) {
    settle(() => {
      writeSaved(keyRef.current, {});
      setOverrides({ seed: seedRef.current, map: {} });
      extra?.();
    });
  }

  function nudge(id: string, key: string, shift: boolean) {
    const piece = pieceById(id);
    const current = viewRef.current[id];
    if (!piece || !current) return;
    const { canvasW, height, fitted } = metrics(piece);
    const step = shift ? 32 : 8;
    const dx = (step / Math.max(canvasW, 1)) * 100;
    const dy = (step / Math.max(height, 1)) * 100;
    let { x, y } = current;
    if (key === "ArrowLeft") x -= dx;
    else if (key === "ArrowRight") x += dx;
    else if (key === "ArrowUp") y -= dy;
    else if (key === "ArrowDown") y += dy;
    else return;
    commit(id, clamp({ ...current, x, y, z: frontZ() }, fitted.wPct));
  }

  function bind(id: string) {
    const piece = defaults.find((item) => item.id === id);
    const place = view[id];
    const fitted = piece ? fit(piece, width, designH, minSize) : null;
    const style: CSSProperties | undefined =
      piece && place
        ? {
            left: `${place.x}%`,
            top: designH ? `${(place.y / 100) * designH}px` : `${place.y}%`,
            width: fitted && fitted.widthPx > 0 ? `${fitted.widthPx}px` : `${piece.w}%`,
            height: fitted && fitted.heightPx > 0 ? `${fitted.heightPx}px` : undefined,
            ["--rot" as string]: `${place.rotation}deg`,
            ["--z" as string]: String(place.z),
          }
        : undefined;
    return {
      className: styles.item,
      "data-arrange-id": id,
      "data-cursor": "grab" as const,
      style,
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        if (event.button !== 0 || !place) return;
        const drag: Drag = {
          id,
          pointerId: event.pointerId,
          coarse: event.pointerType === "touch",
          originX: event.clientX,
          originY: event.clientY,
          start: place,
          lifted: false,
          node: event.currentTarget,
        };
        dragRef.current = drag;
        if (drag.coarse) {
          window.clearTimeout(holdRef.current);
          holdRef.current = window.setTimeout(() => {
            if (dragRef.current === drag) lift(drag);
          }, HOLD_MS);
        }
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (!event.key.startsWith("Arrow")) return;
        event.preventDefault();
        nudge(id, event.key, event.shiftKey);
      },
      onDragStart: (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
      },
    };
  }

  function taken() {
    if (!skipClick.current) return false;
    skipClick.current = false;
    return true;
  }

  const canvasStyle: CSSProperties = {
    ["--design-h" as string]: designH ? `${designH}px` : undefined,
    ["--need-h" as string]: need ? `${Math.ceil(need)}px` : undefined,
    aspectRatio: designH ? undefined : `${design.width} / ${design.height}`,
  };

  return {
    canvasClass: [styles.canvas, settling ? styles.settling : ""].filter(Boolean).join(" "),
    canvasStyle,
    bind,
    taken,
    tidy,
    animate: settle,
    tidyClass: styles.tidy,
    holdClass: styles.hold,
    barClass: styles.bar,
  };
}
