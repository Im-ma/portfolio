"use client";

import { useFreeArrange, type Piece } from "@/components/arrange/use-free-arrange";
import { StickyNote } from "@/components/sticky-note/sticky-note";
import type { WallNote } from "@/lib/notes";
import { useMemo, useRef, useSyncExternalStore } from "react";
import styles from "./home.module.css";

const desktopDesign = { width: 880, height: 340 };
const stackDesign = { width: 360, height: 820 };

function useNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(max-width: 767px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

function piecesFor(notes: WallNote[], narrow: boolean): Piece[] {
  const spots = narrow
    ? [
        { x: 6, y: 2, w: 88, h: 30 },
        { x: 6, y: 35, w: 88, h: 30 },
        { x: 6, y: 68, w: 88, h: 30 },
      ]
    : [
        { x: 14, y: 5, w: 27.2, h: 70 },
        { x: 43.4, y: 16.5, w: 27.2, h: 70 },
        { x: 72.6, y: 2.4, w: 27.2, h: 70 },
      ];
  return notes.map((note, index) => {
    const spot = spots[index] ?? spots[spots.length - 1] ?? { x: 8, y: 8, w: 28, h: 60 };
    return {
      id: `home-${index}`,
      x: spot.x,
      y: spot.y + (index > 2 ? (index - 2) * 36 : 0),
      w: spot.w,
      h: spot.h,
      rotation: note.rotation,
    };
  });
}

export function HomeNotes({ notes }: { notes: WallNote[] }) {
  const narrow = useNarrow();
  const defaults = useMemo(() => piecesFor(notes, narrow), [notes, narrow]);
  const visibleIds = useMemo(() => defaults.map((piece) => piece.id), [defaults]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const arrange = useFreeArrange({
    canvasRef,
    storageKey: narrow ? "im-arrange:home-notes-stack" : "im-arrange:home-notes",
    design: narrow ? stackDesign : desktopDesign,
    defaults,
    visibleIds,
    layout: "saved",
    scatterSeed: 0,
  });

  return (
    <div className={styles.noteStage}>
      <div className={styles.noteTools}>
        <button
          type="button"
          className={`${arrange.tidyClass} t-mono-small`}
          onClick={() => arrange.tidy()}
        >
          Tidy up
        </button>
      </div>
      <div
        ref={canvasRef}
        className={arrange.canvasClass}
        style={arrange.canvasStyle}
        role="group"
        aria-label="Notes from the wall"
      >
        {notes.map((note, index) => {
          const id = `home-${index}`;
          const bound = arrange.bind(id);
          return (
            <div key={id} {...bound} tabIndex={0}>
              <span className="sr-only">Drag to move. Arrow keys nudge. Shift moves farther.</span>
              <StickyNote plain sway={false} {...note} />
            </div>
          );
        })}
      </div>
      <p className={`${arrange.holdClass} t-mono-small`}>Hold, then drag</p>
    </div>
  );
}
