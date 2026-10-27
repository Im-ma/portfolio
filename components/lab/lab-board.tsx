"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/button/button";
import { StatusTag } from "@/components/status-tag/status-tag";
import { TalkAction } from "@/components/talk/talk-action";
import { useTalk } from "@/components/talk/talk-provider";
import { labPage } from "@/lib/content";
import { PriceDemo, QuarantineDemo, RsvpDemo, StopDemo } from "./playables";
import styles from "./lab.module.css";

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

const pilePhotos = [
  { src: "/images/gatherings/standin-study-tables.webp", alt: "overhead study tables" },
  { src: "/images/gatherings/standin-picnic-overhead.webp", alt: "picnic from above" },
  { src: "/images/gatherings/standin-passing-food.webp", alt: "hands passing food" },
];

function PolaroidDemo() {
  const [seed, setSeed] = useState(2);
  const spots = useMemo(() => {
    const random = mulberry32(seed);
    return pilePhotos.map((photo, index) => ({
      ...photo,
      x: 12 + index * 22 + (random() * 18 - 6),
      y: 16 + random() * 28,
      rot: random() * 10 - 5,
    }));
  }, [seed]);
  return (
    <div className={styles.stage}>
      {spots.map((spot) => (
        <span
          key={spot.src}
          className={styles.mini}
          style={{
            left: `${spot.x}%`,
            top: spot.y,
            ["--rot" as string]: `${spot.rot}deg`,
          }}
        >
          <Image src={spot.src} alt={spot.alt} width={160} height={112} />
        </span>
      ))}
      <button
        type="button"
        className={`${styles.demoBtn} t-button-m`}
        onClick={() => setSeed((value) => value + 1)}
      >
        Shuffle
      </button>
    </div>
  );
}

function PressTDemo() {
  const [lit, setLit] = useState(false);
  const { openTalk } = useTalk();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "t" && event.key !== "T") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      setLit(true);
      window.setTimeout(() => setLit(false), 280);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <button
      type="button"
      className={`${styles.stage} ${styles.press}`}
      onClick={() => openTalk("talk:open")}
    >
      <span className={`${styles.keycap} t-heading-h2`} data-lit={lit ? "true" : undefined}>
        T
      </span>
      <span className={`${styles.pressLabel} t-mono-small`}>Press T</span>
    </button>
  );
}

function QueueDemo() {
  const [notes, setNotes] = useState([
    { id: "study", text: "Study session", state: "pending", x: 16, y: 14 },
    { id: "picnic", text: "Saturday picnic", state: "pending", x: 16, y: 108 },
  ]);
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null);
  function setState(id: string, state: string) {
    setNotes((current) => current.map((item) => (item.id === id ? { ...item, state } : item)));
  }
  return (
    <div className={`${styles.stage} ${styles.queue} ${styles.noteDemo}`}>
      {notes.map((note) => (
        <div
          key={note.id}
          className={styles.queueNote}
          data-state={note.state}
          style={{ left: note.x, top: note.y }}
        >
          <button
            type="button"
            className={`${styles.dragHandle} t-body-s`}
            aria-label={`${note.text}. Drag to move, or use arrow keys.`}
            data-cursor="grab"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDrag({ id: note.id, dx: event.clientX - note.x, dy: event.clientY - note.y });
            }}
            onPointerMove={(event) => {
              if (!drag || drag.id !== note.id) return;
              const bounds =
                event.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
              const card = event.currentTarget.parentElement;
              if (!bounds || !card) return;
              const x = Math.min(
                Math.max(8, event.clientX - drag.dx),
                Math.max(8, bounds.width - card.offsetWidth - 8),
              );
              const y = Math.min(
                Math.max(8, event.clientY - drag.dy),
                Math.max(8, bounds.height - card.offsetHeight - 8),
              );
              setNotes((current) =>
                current.map((item) => (item.id === note.id ? { ...item, x, y } : item)),
              );
            }}
            onPointerUp={() => setDrag(null)}
            onKeyDown={(event) => {
              const step = 12;
              if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
              event.preventDefault();
              setNotes((current) =>
                current.map((item) => {
                  if (item.id !== note.id) return item;
                  if (event.key === "ArrowRight") return { ...item, x: item.x + step };
                  if (event.key === "ArrowLeft") return { ...item, x: Math.max(8, item.x - step) };
                  if (event.key === "ArrowDown") return { ...item, y: item.y + step };
                  return { ...item, y: Math.max(8, item.y - step) };
                }),
              );
            }}
          >
            {note.text}
          </button>
          <span className={styles.queueActions}>
            <button
              type="button"
              className="t-mono-small"
              onClick={() => setState(note.id, "approved")}
            >
              Approve
            </button>
            <button
              type="button"
              className="t-mono-small"
              onClick={() => setState(note.id, "hidden")}
            >
              Hide
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

const footerButtons: { label: string; href?: string; action?: string }[] = labPage.footer.buttons;

const smallDemos: Record<string, () => React.JSX.Element> = {
  polaroids: PolaroidDemo,
  queue: QueueDemo,
  press: PressTDemo,
};

const pieceDemos: Record<string, () => React.JSX.Element> = {
  quarantine: QuarantineDemo,
  price: PriceDemo,
  stop: StopDemo,
  rsvp: RsvpDemo,
};

export function LabBoard() {
  return (
    <>
      <ul className={styles.pieces}>
        {labPage.pieces.map((piece) => {
          const Demo = pieceDemos[piece.id];
          return (
            <li key={piece.id}>
              <article className={styles.piece}>
                <header className={styles.pieceHead}>
                  <div className={styles.pieceMeta}>
                    <Link className={`${styles.project} t-mono-label`} href={`/work/${piece.slug}`}>
                      {piece.project} <span aria-hidden="true">→</span>
                    </Link>
                    <StatusTag status={piece.status} />
                  </div>
                  <h2 className="t-heading-h3">{piece.title}</h2>
                  <p className={`${styles.muted} t-body-s`}>{piece.prompt}</p>
                </header>
                {Demo ? <Demo /> : null}
                <p className={`${styles.muted} ${styles.pieceNote} t-mono-small`}>{piece.note}</p>
              </article>
            </li>
          );
        })}
      </ul>

      <section className={styles.site} aria-labelledby="lab-site">
        <h2 id="lab-site" className="t-heading-h2">
          {labPage.site.title}
        </h2>
        <p className={`${styles.muted} ${styles.siteLead} t-body-m`}>{labPage.site.lead}</p>
        <ul className={styles.grid}>
          {labPage.site.tiles.map((tile) => {
            const Demo = smallDemos[tile.id];
            return (
              <li key={tile.id}>
                <article className={styles.tile}>
                  {Demo ? <Demo /> : null}
                  <div className={styles.body}>
                    <StatusTag status={tile.status} />
                    <h3 className="t-heading-h4">{tile.title}</h3>
                    <p className={`${styles.muted} t-body-s`}>{tile.text}</p>
                    <p className={`${styles.stack} t-mono-small`}>{tile.stack}</p>
                    {"href" in tile && tile.href ? (
                      <Link className={`${styles.project} t-mono-small`} href={tile.href}>
                        {tile.linkLabel} <span aria-hidden="true">→</span>
                      </Link>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.cta}>
        <h2 className="t-heading-h2">{labPage.footer.heading}</h2>
        <div className={styles.actions}>
          {footerButtons.map((button) =>
            button.href ? (
              <Button key={button.label} href={button.href} variant="secondary">
                {button.label}
              </Button>
            ) : button.action ? (
              <TalkAction key={button.label} action={button.action}>
                {button.label}
              </TalkAction>
            ) : null,
          )}
        </div>
      </section>
    </>
  );
}
