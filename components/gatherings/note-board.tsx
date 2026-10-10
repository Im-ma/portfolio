"use client";

import { useFreeArrange, type Piece } from "@/components/arrange/use-free-arrange";
import { StickyNote } from "@/components/sticky-note/sticky-note";
import type { PlacedNote } from "@/lib/notes";
import { useMemo, useRef } from "react";
import styles from "./gatherings.module.css";

export function NoteBoard({
  notes,
  board,
  lead,
}: {
  notes: PlacedNote[];
  board: { width: number; height: number };
  lead: string;
}) {
  const defaults = useMemo<Piece[]>(
    () =>
      notes.map((note, index) => ({
        id: `wall-${index}`,
        x: (note.x / board.width) * 100,
        y: (note.y / board.height) * 100,
        w: (note.width / board.width) * 100,
        h: (note.height / board.height) * 100,
        rotation: note.rotation,
      })),
    [notes, board.width, board.height],
  );

  const visibleIds = useMemo(() => defaults.map((piece) => piece.id), [defaults]);
  const minSize = useMemo(() => ({ width: 168, height: 150 }), []);
  const canvasRef = useRef<HTMLDivElement>(null);

  const arrange = useFreeArrange({
    canvasRef,
    storageKey: "im-arrange:gatherings-notes",
    design: board,
    defaults,
    visibleIds,
    layout: "saved",
    scatterSeed: 0,
    minSize,
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
