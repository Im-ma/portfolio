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

type ScaleMode = "uniform" | "readable";

function fit(
  piece: Piece,
  canvasW: number,
  boardH: number,
  design: { width: number; height: number },
  mode: ScaleMode,
  minSize?: MinSize,
): Fitted {
  const naturalW = canvasW > 0 ? (piece.w / 100) * canvasW : 0;
  const naturalH = boardH > 0 ? (piece.h / 100) * boardH : 0;
  let widthPx = naturalW;
  let heightPx = naturalH;
  if (mode === "readable") {
    const authoredW = (piece.w / 100) * design.width;
    const authoredH = (piece.h / 100) * design.height;
    // Shrink with the canvas so a row of notes keeps its gaps. Never grow past the authored size.
    const scaleFactor = canvasW > 0 && design.width > 0 ? Math.min(1, canvasW / design.width) : 1;
    widthPx = authoredW * scaleFactor;
    heightPx = authoredH * scaleFactor;
  }
  if (minSize && widthPx > 0 && heightPx > 0 && mode === "uniform") {
    let scale = Math.max(1, minSize.width / widthPx, minSize.height / heightPx);
    scale = Math.min(scale, Math.max(canvasW - 8, 1) / widthPx);
    widthPx *= scale;
    heightPx *= scale;
  }
  if (mode === "readable" && canvasW > 0) {
    widthPx = Math.min(widthPx, Math.max(canvasW - 16, 1));
  }
  const wPct = canvasW > 0 ? (widthPx / canvasW) * 100 : piece.w;
  return { widthPx, heightPx, wPct };
}

function horizontalInset(rotation: number, widthPx: number, heightPx: number, canvasW: number) {
  if (canvasW <= 0 || widthPx <= 0 || heightPx <= 0) return 0;
  const rad = (Math.abs(rotation) * Math.PI) / 180;
  const bounds = widthPx * Math.abs(Math.cos(rad)) + heightPx * Math.abs(Math.sin(rad));
  const extra = Math.max(0, (bounds - widthPx) / 2 + 2);
  return (extra / canvasW) * 100;
}

function clamp(place: Place, wPct: number, insetPct = 0): Place {
  const room = Math.max(0, 100 - wPct);
  const inset = Math.min(Math.max(0, insetPct), room / 2);
  return {
    ...place,
    x: Math.min(Math.max(inset, place.x), Math.max(inset, room - inset)),
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
  scale = "uniform",
}: {
  canvasRef: RefObject<HTMLDivElement | null>;
  storageKey: string;
  design: { width: number; height: number };
  defaults: Piece[];
  visibleIds: string[];
  layout: "saved" | "scatter";
  scatterSeed: number;
  minSize?: MinSize;
  /** readable keeps a note's designed size and lets the canvas grow. uniform scales photos with the board. */
  scale?: ScaleMode;
}) {
  const saved = useSaved(storageKey);
  const [overrides, setOverrides] = useState<{ seed: number; map: Record<string, Place> }>({
    seed: -1,
    map: {},
  });
  const [settling, setSettling] = useState(false);
  const [width, setWidth] = useState(0);
  const [grown, setGrown] = useState<Record<string, number>>({});
  const designRef = useRef(design);
  const defaultsRef = useRef(defaults);
  const layoutRef = useRef(layout);
  const seedRef = useRef(scatterSeed);
  const keyRef = useRef(storageKey);
  const minSizeRef = useRef(minSize);
  const scaleRef = useRef(scale);
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

  const boardH =
    scale === "readable" ? design.height : width > 0 ? (width * design.height) / design.width : 0;

  const view = useMemo(() => {
    const map: Record<string, Place> = {};
    for (const [id, place] of Object.entries(live)) {
      const piece = defaults.find((item) => item.id === id);
      if (!piece) continue;
      const fitted = fit(piece, width, boardH, design, scale, minSize);
      const box = Math.max(fitted.heightPx, grown[id] ?? 0);
      const inset =
        scale === "readable" ? horizontalInset(place.rotation, fitted.widthPx, box, width) : 0;
      map[id] = clamp(place, width > 0 ? fitted.wPct : piece.w, inset);
    }
    return map;
  }, [live, defaults, width, boardH, design, scale, minSize, grown]);

  let need = boardH;
  for (const id of visibleIds) {
    const piece = defaults.find((item) => item.id === id);
    const place = view[id];
    if (!piece || !place || !boardH) continue;
    const fitted = fit(piece, width, boardH, design, scale, minSize);
    const top = (place.y / 100) * boardH;
    const box = Math.max(fitted.heightPx, grown[id] ?? 0);
    const rad = (Math.abs(place.rotation) * Math.PI) / 180;
    const spill =
      scale === "readable"
        ? Math.max(0, (fitted.widthPx * Math.sin(rad) + box * Math.cos(rad) - box) / 2)
        : 0;
    need = Math.max(need, top + box + spill + 28);
  }

  useEffect(() => {
    designRef.current = design;
    defaultsRef.current = defaults;
    layoutRef.current = layout;
    seedRef.current = scatterSeed;
    keyRef.current = storageKey;
    minSizeRef.current = minSize;
    viewRef.current = view;
    scaleRef.current = scale;
  }, [design, defaults, layout, scatterSeed, storageKey, minSize, view, scale]);

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

  const visibleKey = visibleIds.join("|");
  useEffect(() => {
    if (scale !== "readable") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const next: Record<string, number> = {};
      canvas.querySelectorAll<HTMLElement>("[data-arrange-id]").forEach((node) => {
        const id = node.dataset.arrangeId;
        if (!id) return;
        next[id] = node.offsetHeight;
      });
      setGrown((current) => {
        const ids = Object.keys(next);
        const same =
          ids.length === Object.keys(current).length &&
          ids.every((id) => Math.abs((current[id] ?? 0) - next[id]) < 2);
        return same ? current : next;
      });
    });
    canvas
      .querySelectorAll<HTMLElement>("[data-arrange-id]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [canvasRef, scale, width, visibleKey]);

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
    const height =
      scaleRef.current === "readable"
        ? designRef.current.height
        : canvasW > 0
          ? (canvasW * designRef.current.height) / designRef.current.width
          : 0;
    return {
      canvasW,
      height,
      fitted: fit(piece, canvasW, height, designRef.current, scaleRef.current, minSizeRef.current),
    };
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
    const { canvasW, fitted } = metrics(piece);
    const node = canvasRef.current?.querySelector<HTMLElement>(
      `[data-arrange-id="${CSS.escape(id)}"]`,
    );
    const box =
      scaleRef.current === "readable" ? node?.offsetHeight || fitted.heightPx : fitted.heightPx;
    const inset =
      scaleRef.current === "readable"
        ? horizontalInset(place.rotation, fitted.widthPx, box, canvasW)
        : 0;
    const next = clamp(place, fitted.wPct, inset);
    viewRef.current = { ...viewRef.current, [id]: next };
    if (layoutRef.current === "scatter") {
      setOverrides((current) => ({
        seed: seedRef.current,
        map: { ...(current.seed === seedRef.current ? current.map : {}), [id]: next },
      }));
      return;
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
    const box = scaleRef.current === "readable" ? drag.node.offsetHeight : fitted.heightPx;
    const inset =
      scaleRef.current === "readable"
        ? horizontalInset(drag.start.rotation, fitted.widthPx, box, canvasW)
        : 0;
    const next = clamp(
      { ...drag.start, x: drag.start.x + dx, y: drag.start.y + dy },
      fitted.wPct,
      inset,
    );
    const topPx = (next.y / 100) * height;
    drag.node.style.left = `${next.x}%`;
    drag.node.style.top = `${topPx}px`;
    drag.node.style.zIndex = String(drag.start.z);
    if (scaleRef.current === "readable" && canvasRef.current) {
      const box = drag.node.offsetHeight;
      const rad = (Math.abs(next.rotation) * Math.PI) / 180;
      const spill = Math.max(0, (fitted.widthPx * Math.sin(rad) + box * Math.cos(rad) - box) / 2);
      const needPx = Math.ceil(topPx + box + spill + 28);
      const canvas = canvasRef.current;
      const current =
        Number.parseFloat(canvas.style.getPropertyValue("--need-h")) || canvas.clientHeight;
      if (needPx > current) canvas.style.setProperty("--need-h", `${needPx}px`);
    }
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
          window.setTimeout(() => {
            skipClick.current = false;
          }, 80);
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
    const fitted = piece ? fit(piece, width, boardH, design, scale, minSize) : null;
    const style: CSSProperties | undefined =
      piece && place
        ? {
            left: `${place.x}%`,
            top: boardH ? `${(place.y / 100) * boardH}px` : `${place.y}%`,
            width: fitted && fitted.widthPx > 0 ? `${fitted.widthPx}px` : `${piece.w}%`,
            height:
              scale === "readable"
                ? "auto"
                : fitted && fitted.heightPx > 0
                  ? `${fitted.heightPx}px`
                  : undefined,
            minHeight:
              scale === "readable" && fitted && fitted.heightPx > 0
                ? `${fitted.heightPx}px`
                : undefined,
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
    ["--design-h" as string]: boardH ? `${boardH}px` : undefined,
    ["--need-h" as string]: need ? `${Math.ceil(need)}px` : undefined,
    aspectRatio: boardH ? undefined : `${design.width} / ${design.height}`,
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
