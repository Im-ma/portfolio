"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { sampleRecords } from "./sample-data";
import styles from "./trace-play.module.css";
import { TryIt } from "./try-it";

const rows = sampleRecords.filter((record) =>
  ["rec_demo_03", "rec_demo_01", "rec_demo_05", "rec_demo_06"].includes(record.id),
);

type Pattern = "common" | "trace";

export function InspectDemo() {
  const [pattern, setPattern] = useState<Pattern>("trace");
  const [inspected, setInspected] = useState(rows[0].id);
  const [selected, setSelected] = useState<string[]>([]);
  const [held, setHeld] = useState<string[]>([]);
  const [note, setNote] = useState("You always know exactly what a button will touch.");
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function reset() {
    setPattern("trace");
    setInspected(rows[0].id);
    setSelected([]);
    setHeld([]);
    setNote("You always know exactly what a button will touch.");
  }

  function choosePattern(next: Pattern) {
    setPattern(next);
    setSelected([]);
    setNote(
      next === "trace"
        ? "You always know exactly what a button will touch."
        : "You might be reading one record and accidentally act on it, or act on a set you didn't mean to.",
    );
  }

  function highlight(id: string) {
    setInspected(id);
    rowRefs.current[id]?.focus();
  }

  function inspect(id: string) {
    setInspected(id);
    if (pattern === "common" && !held.includes(id)) {
      setSelected((current) => (current.includes(id) ? current : [...current, id]));
      setNote(
        "You might be reading one record and accidentally act on it, or act on a set you didn't mean to.",
      );
    }
  }

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function onRowKey(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    const index = rows.findIndex((row) => row.id === id);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlight(rows[Math.min(rows.length - 1, index + 1)].id);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      highlight(rows[Math.max(0, index - 1)].id);
    } else if (event.key === "Home") {
      event.preventDefault();
      highlight(rows[0].id);
    } else if (event.key === "End") {
      event.preventDefault();
      highlight(rows[rows.length - 1].id);
    } else if (event.key === " ") {
      event.preventDefault();
      toggle(id);
    }
  }

  const touched = selected.filter((id) => !held.includes(id));
  const current = rows.find((row) => row.id === inspected) ?? rows[0];
  const restoreDisabled = !selected.some((id) => held.includes(id));

  return (
    <TryIt
      id="play-decision-3"
      hint="Click a row to read it, then see what Quarantine will touch."
      onReset={reset}
    >
      <p className={`${styles.sample} t-mono-tag`}>Sample data</p>
      <div className={styles.modes} role="group" aria-label="Common pattern or Trace">
        <button
          type="button"
          className={styles.mode}
          aria-pressed={pattern === "common"}
          onClick={() => choosePattern("common")}
        >
          Common pattern
        </button>
        <button
          type="button"
          className={styles.mode}
          aria-pressed={pattern === "trace"}
          onClick={() => choosePattern("trace")}
        >
          Trace
        </button>
      </div>
      <p className={`${styles.legend} t-body-s`}>
        <span>
          <i className={styles.dot} aria-hidden="true" />
          Highlighted row: what you&apos;re inspecting. It drives the inspector.
        </span>
        <span>
          <i className={styles.boxKey} aria-hidden="true" />
          Checkbox: what you&apos;ve selected.
        </span>
      </p>
      <div className={styles.layout}>
        <ul className={styles.records}>
          {rows.map((row) => (
            <li key={row.id} className={styles.record}>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  aria-label={`Select ${row.id}`}
                  onChange={() => toggle(row.id)}
                />
              </label>
              <button
                type="button"
                className={`${styles.recordButton} ${styles.compact}`}
                aria-pressed={inspected === row.id}
                tabIndex={row.id === inspected ? 0 : -1}
                ref={(node) => {
                  rowRefs.current[row.id] = node;
                }}
                onClick={() => inspect(row.id)}
                onKeyDown={(event) => onRowKey(event, row.id)}
              >
                <span className={styles.id}>{row.id}</span>
                <span className={styles.issue}>
                  {held.includes(row.id)
                    ? "Held aside"
                    : row.issue === "none"
                      ? "No issue"
                      : row.issue}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <aside className={styles.inspector} aria-label="Record inspector">
          <h4 className="t-heading-h4">Inspector</h4>
          <p className={styles.id}>{current.id}</p>
          <p className="t-body-s">
            {held.includes(current.id)
              ? "This record is held aside. Its original data has been preserved."
              : current.plain}
          </p>
          {held.includes(current.id) ? (
            <p className={`${styles.muted} t-body-s`}>{current.plain}</p>
          ) : null}
        </aside>
      </div>
      <p className="t-body-s" role="status">
        {touched.length
          ? `Quarantine will touch: ${touched.join(", ")}.`
          : "Quarantine will touch nothing."}{" "}
        {note}
      </p>
      <div className={styles.bulkActions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.primary}`}
          disabled={touched.length === 0}
          onClick={() => {
            setHeld((currentHeld) => [...new Set([...currentHeld, ...touched])]);
            setSelected((currentSelected) => currentSelected.filter((id) => !touched.includes(id)));
            setNote("Quarantine preserves the source record.");
          }}
        >
          Quarantine
        </button>
        <button
          type="button"
          className={styles.btn}
          disabled={restoreDisabled}
          onClick={() => {
            const restoring = selected.filter((id) => held.includes(id));
            setHeld((currentHeld) => currentHeld.filter((id) => !restoring.includes(id)));
            setSelected((currentSelected) =>
              currentSelected.filter((id) => !restoring.includes(id)),
            );
          }}
        >
          Restore
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.quiet}`}
          onClick={() => setSelected([])}
        >
          Clear selection
        </button>
      </div>
      {restoreDisabled ? (
        <p className={`${styles.hint} t-body-s`}>
          Restore stays disabled because nothing selected is quarantined yet.
        </p>
      ) : null}
    </TryIt>
  );
}
