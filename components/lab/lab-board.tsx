"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { StatusTag } from "@/components/status-tag/status-tag";
import { TalkAction } from "@/components/talk/talk-action";
import { useTalk } from "@/components/talk/talk-provider";
import { labPage } from "@/lib/content";
import { showAnnotations } from "@/lib/show-checks";
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

function NoteDemo() {
  const [pos, setPos] = useState({ x: 28, y: 36 });
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  return (
    <div className={`${styles.stage} ${styles.noteDemo}`}>
      <button
        type="button"
        className={`${styles.dragNote} t-hand-note`}
        style={{ left: pos.x, top: pos.y }}
        aria-label="Draggable note. Use arrow keys to move it."
        data-cursor="grab"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag({ dx: event.clientX - pos.x, dy: event.clientY - pos.y });
        }}
        onPointerMove={(event) => {
          if (!drag) return;
          const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
          if (!bounds) return;
          const note = event.currentTarget;
          const x = Math.min(
            Math.max(8, event.clientX - drag.dx),
            Math.max(8, bounds.width - note.offsetWidth - 8),
          );
          const y = Math.min(
            Math.max(8, event.clientY - drag.dy),
            Math.max(8, bounds.height - note.offsetHeight - 8),
          );
          setPos({ x, y });
        }}
        onPointerUp={() => setDrag(null)}
        onKeyDown={(event) => {
          const step = 12;
          if (event.key === "ArrowRight") setPos((point) => ({ ...point, x: point.x + step }));
          if (event.key === "ArrowLeft")
            setPos((point) => ({ ...point, x: Math.max(8, point.x - step) }));
          if (event.key === "ArrowDown") setPos((point) => ({ ...point, y: point.y + step }));
          if (event.key === "ArrowUp")
            setPos((point) => ({ ...point, y: Math.max(8, point.y - step) }));
        }}
      >
        Drag me
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

const tokenChoices = [
  { name: "Accent", color: "var(--color-accent)" },
  { name: "Signal", color: "var(--color-signal)" },
  { name: "Ink", color: "var(--color-ink)" },
];

function TokenDemo() {
  const [active, setActive] = useState(0);
  const choice = tokenChoices[active] ?? tokenChoices[0];
  return (
    <div className={styles.stage}>
      <span className={styles.swatch} style={{ background: choice.color }} />
      <span className={styles.tokenRow}>
        {tokenChoices.map((token, index) => (
          <button
            key={token.name}
            type="button"
            className={`${styles.token} t-mono-small`}
            data-active={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
          >
            {token.name}
          </button>
        ))}
      </span>
    </div>
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

function PriceDemo() {
  const suggested = 18;
  const [value, setValue] = useState(suggested);
  return (
    <div className={`${styles.stage} ${styles.price}`}>
      <p className="t-heading-h3">${value}</p>
      <p className={`${styles.muted} t-mono-small`}>
        {value === suggested ? "Suggested" : "Your offer"}
      </p>
      <input
        type="range"
        min={8}
        max={32}
        value={value}
        aria-label="Offer"
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  );
}

function HandDemo() {
  const [pos, setPos] = useState({ x: 48, y: 48 });
  return (
    <div
      className={styles.stage}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setPos({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
      }}
    >
      <span className={styles.cursor} style={{ left: pos.x, top: pos.y }} aria-hidden="true" />
    </div>
  );
}

function FlagDemo() {
  const [flagged, setFlagged] = useState<string[]>([]);
  const [held, setHeld] = useState<string[]>([]);
  const rows = ["01", "02", "03", "04"];
  return (
    <div className={`${styles.stage} ${styles.flag}`}>
      {rows.map((row) => (
        <button
          key={row}
          type="button"
          className={styles.flagRow}
          data-flagged={flagged.includes(row) ? "true" : undefined}
          data-held={held.includes(row) ? "true" : undefined}
          onClick={() =>
            setFlagged((current) =>
              current.includes(row) ? current.filter((item) => item !== row) : [...current, row],
            )
          }
        >
          <span className="t-mono-number">{row}</span>
          <span className="t-body-xs">
            {held.includes(row) ? "Quarantined" : flagged.includes(row) ? "Flagged" : "Clear"}
          </span>
        </button>
      ))}
      <button
        type="button"
        className={`${styles.demoBtn} t-button-m`}
        onClick={() => {
          setHeld((current) => [...new Set([...current, ...flagged])]);
          setFlagged([]);
        }}
      >
        Quarantine
      </button>
    </div>
  );
}

function SwipeDemo() {
  const [x, setX] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  const [result, setResult] = useState<"Saved" | "Skipped" | null>(null);
  function finish(next: number) {
    if (next > 72) setResult("Saved");
    else if (next < -72) setResult("Skipped");
    setX(0);
    setStart(null);
  }
  return (
    <div className={`${styles.stage} ${styles.swipe}`}>
      <div
        className={styles.swipeCard}
        data-cursor="grab"
        style={{ transform: `translateX(${x}px)` }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setStart(event.clientX);
          setResult(null);
        }}
        onPointerMove={(event) => {
          if (start === null) return;
          setX(event.clientX - start);
        }}
        onPointerUp={() => finish(x)}
      >
        <span className="t-body-m-strong">{result ?? "Tonight"}</span>
        <span className={`${styles.muted} t-body-xs`}>Flick to save or skip</span>
      </div>
      <span className={styles.swipeActions}>
        <button type="button" className="t-mono-small" onClick={() => setResult("Skipped")}>
          Skip
        </button>
        <button type="button" className="t-mono-small" onClick={() => setResult("Saved")}>
          Save
        </button>
      </span>
    </div>
  );
}

function Demo({ title }: { title: string }) {
  if (title === "Polaroid pile") return <PolaroidDemo />;
  if (title === "Note wall queue") return <QueueDemo />;
  if (title === "Press T to talk") return <PressTDemo />;
  if (title === "Token playground") return <TokenDemo />;
  if (title === "Name your price") return <PriceDemo />;
  if (title === "Hand cursor") return <HandDemo />;
  if (title === "Flag a row") return <FlagDemo />;
  if (title === "Swipe for tonight") return <SwipeDemo />;
  return <NoteDemo />;
}

export function LabBoard() {
  const [filter, setFilter] = useState("all");
  const tiles = labPage.tiles.filter((tile) => filter === "all" || tile.filter === filter);
  return (
    <>
      <div className={styles.filters} role="radiogroup" aria-label="Filter experiments">
        {labPage.filters.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={filter === item.value}
            className={`${styles.chip} t-body-nav`}
            data-active={filter === item.value ? "true" : undefined}
            tabIndex={filter === item.value ? 0 : -1}
            onClick={() => setFilter(item.value)}
            onKeyDown={(event) => {
              const values = labPage.filters.map((entry) => entry.value);
              const index = values.indexOf(filter);
              const next =
                event.key === "ArrowRight" || event.key === "ArrowDown"
                  ? values[(index + 1) % values.length]
                  : event.key === "ArrowLeft" || event.key === "ArrowUp"
                    ? values[(index - 1 + values.length) % values.length]
                    : null;
              if (!next) return;
              event.preventDefault();
              setFilter(next);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {showAnnotations() && labPage.pageNote.devOnly ? (
        <p className={`${styles.note} t-mono-small`}>
          {labPage.pageNote.text}
          {labPage.pageNote.check ? <Check note={labPage.pageNote.checkNote} /> : null}
        </p>
      ) : null}
      <ul className={styles.grid}>
        {tiles.map((tile) => (
          <li key={tile.title}>
            <article className={styles.tile}>
              <Demo title={tile.title} />
              <div className={styles.body}>
                <StatusTag status={tile.status} />
                <h2 className="t-heading-h4">
                  {tile.title}
                  {tile.check ? <Check /> : null}
                </h2>
                <p className={`${styles.muted} t-body-s`}>{tile.text}</p>
                <p className={`${styles.stack} t-mono-small`}>{tile.stack}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <section className={styles.cta}>
        <h2 className="t-heading-h2">{labPage.footer.heading}</h2>
        <div className={styles.actions}>
          {labPage.footer.buttons.map((button) =>
            "href" in button && button.href ? (
              <Button key={button.label} href={button.href} variant="secondary">
                {button.label}
                {"check" in button && button.check ? <Check note={button.checkNote} /> : null}
              </Button>
            ) : "action" in button && button.action ? (
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
