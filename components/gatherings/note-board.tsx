"use client";

import { useFreeArrange, type Piece } from "@/components/arrange/use-free-arrange";
import { StickyNote } from "@/components/sticky-note/sticky-note";
import type { PlacedNote } from "@/lib/notes";
import { useMemo, useRef, useSyncExternalStore } from "react";
import styles from "./gatherings.module.css";

type WallMode = "board" | "pair" | "stack";

const pairDesign = { width: 560, height: 1280 };
const stackDesign = { width: 360, height: 2400 };

function useWallMode(): WallMode {
  return useSyncExternalStore(
    (onChange) => {
      const wide = window.matchMedia("(min-width: 1200px)");
      const narrow = window.matchMedia("(max-width: 639px)");
      wide.addEventListener("change", onChange);
      narrow.addEventListener("change", onChange);
      return () => {
        wide.removeEventListener("change", onChange);
        narrow.removeEventListener("change", onChange);
      };
    },
    () => {
      if (window.matchMedia("(max-width: 639px)").matches) return "stack";
      if (window.matchMedia("(min-width: 1200px)").matches) return "board";
      return "pair";
    },
    () => "board" as WallMode,
  );
}

export function NoteBoard({
  notes,
  board,
  lead,
}: {
  notes: PlacedNote[];
  board: { width: number; height: number };
  lead: string;
}) {
  const mode = useWallMode();
  const defaults = useMemo<Piece[]>(() => {
    if (mode === "stack") {
      return notes.map((note, index) => ({
        id: `wall-${index}`,
        x: 4,
        y: 1.5 + index * 12,
        w: 92,
        h: 9,
        rotation: note.rotation,
      }));
    }
    if (mode === "pair") {
      return notes.map((note, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        return {
          id: `wall-${index}`,
          x: col === 0 ? 4 : 52,
          y: 2 + row * 24,
          w: 44,
          h: 18,
          rotation: note.rotation,
        };
      });
    }
    return notes.map((note, index) => ({
      id: `wall-${index}`,
      x: (note.x / board.width) * 100,
      y: (note.y / board.height) * 100,
      w: (note.width / board.width) * 100,
      h: (note.height / board.height) * 100,
      rotation: note.rotation,
    }));
  }, [notes, board.width, board.height, mode]);

  const visibleIds = useMemo(() => defaults.map((piece) => piece.id), [defaults]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const design = mode === "stack" ? stackDesign : mode === "pair" ? pairDesign : board;
  const storageKey =
    mode === "stack"
      ? "im-arrange:gatherings-notes-stack"
      : mode === "pair"
        ? "im-arrange:gatherings-notes-pair"
        : "im-arrange:gatherings-notes";

  const arrange = useFreeArrange({
    canvasRef,
    storageKey,
    design,
    defaults,
    visibleIds,
    layout: "saved",
    scatterSeed: 0,
    scale: "readable",
  });

  return (
    <>
      <div className={styles.wallBar}>
        <p className={`${styles.wallLead} t-body-m`}>{lead}</p>
        <button
          type="button"
          className={`${arrange.tidyClass} ${styles.tidySlot} t-mono-small`}
          onClick={() => arrange.tidy()}
        >
          Tidy up
        </button>
      </div>
      <div
        ref={canvasRef}
        className={`${styles.board} ${arrange.canvasClass}`}
        style={arrange.canvasStyle}
        role="group"
        aria-label="Note wall"
      >
        {notes.map((note, index) => {
          const id = `wall-${index}`;
          const bound = arrange.bind(id);
          return (
            <div
              key={id}
              {...bound}
              className={`${styles.slot} ${bound.className ?? ""}`}
              tabIndex={0}
            >
              <span className="sr-only">Drag to move. Arrow keys nudge. Shift moves farther.</span>
              <StickyNote
                plain
                text={note.text}
                signature={note.signature}
                rotation={note.rotation}
                color={note.color}
                attachment={note.attachment}
                check={note.check}
                checkNote={note.checkNote}
              />
            </div>
          );
        })}
      </div>
      <p className={`${arrange.holdClass} t-mono-small`}>Hold, then drag</p>
    </>
  );
}
