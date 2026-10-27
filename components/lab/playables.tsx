"use client";

import { useState } from "react";
import styles from "./playables.module.css";

/* Trace: delete vs quarantine --------------------------------------------- */

type RecordStatus = "invalid" | "warning" | "quarantined";

type SampleRecord = {
  id: string;
  issue: string;
  status: RecordStatus;
  was: "invalid" | "warning";
};

const sampleRecords: SampleRecord[] = [
  { id: "rec_01284", issue: "Missing label", status: "invalid", was: "invalid" },
  { id: "rec_01285", issue: "Missing label", status: "invalid", was: "invalid" },
  { id: "rec_01289", issue: "Invalid dimensions", status: "invalid", was: "invalid" },
  { id: "rec_01291", issue: "Duplicate frame", status: "invalid", was: "invalid" },
  { id: "rec_01292", issue: "Low resolution", status: "warning", was: "warning" },
];

const quarantineIntro = "Select records, then delete them or move them aside.";

export function QuarantineDemo() {
  const [rows, setRows] = useState<SampleRecord[]>(sampleRecords);
  const [picked, setPicked] = useState<string[]>([]);
  const [deleted, setDeleted] = useState(0);
  const [message, setMessage] = useState(quarantineIntro);

  const blocking = rows.filter((row) => row.status === "invalid").length;
  const held = rows.filter((row) => row.status === "quarantined").length;

  function toggle(id: string) {
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function remove() {
    if (picked.length === 0) return;
    setRows((current) => current.filter((row) => !picked.includes(row.id)));
    setDeleted((count) => count + picked.length);
    setMessage(
      `Deleted ${picked.length}. They are gone, so nobody can audit them later and nobody can undo it.`,
    );
    setPicked([]);
  }

  function moveAside() {
    if (picked.length === 0) return;
    setRows((current) =>
      current.map((row) => (picked.includes(row.id) ? { ...row, status: "quarantined" } : row)),
    );
    setMessage(
      `Quarantined ${picked.length}. Left out of training, kept exactly as they were. Restoring one runs validation again.`,
    );
    setPicked([]);
  }

  function restore(id: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status: row.was } : row)));
    setMessage(
      `Restored ${id}, then validation ran again. Nothing about it was fixed, so it is flagged again.`,
    );
  }

  function reset() {
    setRows(sampleRecords);
    setPicked([]);
    setDeleted(0);
    setMessage(quarantineIntro);
  }

  const ready = blocking === 0;

  return (
    <div className={styles.demo}>
      <div className={styles.bar}>
        <span className="t-mono-small">Batch 024 (sample)</span>
        <span className={styles.pill} data-tone={ready ? "good" : "bad"}>
          {ready ? "Ready to train" : `${blocking} blocking training`}
          {held > 0 ? `, ${held} quarantined` : ""}
        </span>
      </div>
      <ul className={styles.records}>
        {rows.map((row) => (
          <li
            key={row.id}
            className={styles.record}
            data-status={row.status}
            data-picked={picked.includes(row.id) ? "true" : undefined}
          >
            <label className={styles.recordLabel}>
              <input
                type="checkbox"
                checked={picked.includes(row.id)}
                disabled={row.status === "quarantined"}
                onChange={() => toggle(row.id)}
              />
              <span className="t-mono-small">{row.id}</span>
              <span className={`${styles.issue} t-body-xs`}>{row.issue}</span>
            </label>
            {row.status === "quarantined" ? (
              <button type="button" className={styles.linkBtn} onClick={() => restore(row.id)}>
                Restore
              </button>
            ) : (
              <span className={`${styles.state} t-mono-tag`}>
                {row.status === "invalid" ? "Invalid" : "Warning"}
              </span>
            )}
          </li>
        ))}
        {rows.length === 0 ? (
          <li className={`${styles.empty} t-body-s`}>No records left to look at.</li>
        ) : null}
      </ul>
      <div className={styles.actions}>
        <button type="button" className={styles.btn} data-kind="danger" onClick={remove}>
          Delete
        </button>
        <button type="button" className={styles.btn} data-kind="primary" onClick={moveAside}>
          Quarantine
        </button>
        <button type="button" className={styles.linkBtn} onClick={reset}>
          Reset
        </button>
      </div>
      <p className={`${styles.message} t-body-s`} role="status" aria-live="polite">
        {message}
        {ready && deleted > 0 ? ` The batch says ready, with ${deleted} records gone.` : ""}
      </p>
    </div>
  );
}

/* Campus Ride: name your price -------------------------------------------- */

const suggested = 7;

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

export function PriceDemo() {
  const [offer, setOffer] = useState(6);
  const [note, setNote] = useState("");

  const offers = offer >= 7 ? 4 : offer >= 6 ? 2 : offer >= 5 ? 1 : 0;
  const raised = suggested + 1;

  function change(next: number) {
    setNote("");
    setOffer(Math.min(12, Math.max(3, next)));
  }

  return (
    <div className={styles.demo}>
      <div className={styles.priceRow}>
        <div>
          <p className={`${styles.small} t-mono-small`}>Suggested price</p>
          <p className="t-heading-h3">{money(suggested)}</p>
        </div>
        <div>
          <p className={`${styles.small} t-mono-small`}>Your offer</p>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.step}
              aria-label="Lower the offer by 50 cents"
              onClick={() => change(offer - 0.5)}
            >
              −
            </button>
            <output className="t-heading-h3" aria-live="polite">
              {money(offer)}
            </output>
            <button
              type="button"
              className={styles.step}
              aria-label="Raise the offer by 50 cents"
              onClick={() => change(offer + 0.5)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      {offers === 0 ? (
        <div className={styles.result} data-tone="bad" role="status">
          <p className="t-body-m-strong">No drivers available</p>
          <p className={`${styles.small} t-body-s`}>
            Nobody took {money(offer)}. Raise it or schedule for later.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btn}
              data-kind="primary"
              onClick={() => change(raised)}
            >
              Raise to {money(raised)}
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => setNote("Scheduled for later. The request waits instead of failing.")}
            >
              Schedule for later
            </button>
          </div>
          {note ? <p className={`${styles.small} t-body-s`}>{note}</p> : null}
        </div>
      ) : (
        <div className={styles.result} data-tone="good" role="status">
          <p className="t-body-m-strong">
            {offers} driver {offers === 1 ? "offer" : "offers"} coming in
          </p>
          <p className={`${styles.small} t-body-s`}>
            {offer >= suggested
              ? "One is tagged Best Match."
              : "A little under the suggestion, so fewer drivers say yes."}
          </p>
        </div>
      )}
    </div>
  );
}

/* Mimic: pause vs emergency stop ------------------------------------------ */

type ArmState = "following" | "paused" | "stopped";

export function StopDemo() {
  const [state, setState] = useState<ArmState>("following");
  const [hand, setHand] = useState(0);
  const [angle, setAngle] = useState(0);

  function moveHand(value: number) {
    setHand(value);
    if (state === "following") setAngle(value);
  }

  function togglePause() {
    if (state === "stopped") return;
    if (state === "paused") {
      setState("following");
      setAngle(hand);
    } else {
      setState("paused");
    }
  }

  function stop() {
    setState("stopped");
  }

  function reset() {
    setState("following");
    setAngle(hand);
  }

  const caption =
    state === "following"
      ? "Following your hand."
      : state === "paused"
        ? "Paused. Your hand is ignored and the arm holds where it is."
        : "Emergency stop. The arm halted. Reset before it will move again.";

  return (
    <div
      className={styles.demo}
      tabIndex={0}
      aria-label="Arm control demo. Press Space for emergency stop."
      onKeyDown={(event) => {
        if (event.key !== " " || event.target instanceof HTMLButtonElement) return;
        event.preventDefault();
        stop();
      }}
    >
      <div className={styles.armStage} data-state={state}>
        <span className={styles.base} aria-hidden="true" />
        <span
          className={styles.arm}
          aria-hidden="true"
          style={{ ["--angle" as string]: `${angle}deg` }}
        >
          <span className={styles.claw} />
        </span>
      </div>
      <label className={styles.slider}>
        <span className={`${styles.small} t-mono-small`}>Your hand</span>
        <input
          type="range"
          min={-60}
          max={60}
          value={hand}
          disabled={state === "stopped"}
          onChange={(event) => moveHand(Number(event.target.value))}
        />
      </label>
      <div className={styles.stopRow}>
        <button
          type="button"
          className={styles.pause}
          aria-pressed={state === "paused"}
          disabled={state === "stopped"}
          onClick={togglePause}
        >
          <span className="t-body-m-strong">
            {state === "paused" ? "Resume control" : "Pause Control"}
          </span>
          <span className="t-body-xs">Temporarily stop sending gesture commands</span>
        </button>
        <button type="button" className={styles.stop} disabled={state === "stopped"} onClick={stop}>
          <span className="t-body-m-strong">Emergency Stop</span>
          <span className="t-body-xs">Immediately halt all arm movement</span>
        </button>
      </div>
      <p className={`${styles.message} t-body-s`} role="status" aria-live="polite">
        {caption}
        {state === "stopped" ? (
          <>
            {" "}
            <button type="button" className={styles.linkBtn} onClick={reset}>
              Reset
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}

/* Campus Events: RSVP states ---------------------------------------------- */

const rsvpStates = [
  { id: "open", label: "Open", button: "RSVP", line: "Free, 184 spots left" },
  { id: "going", label: "Going", button: "You are in", line: "Ticket saved to You" },
  {
    id: "full",
    label: "Full",
    button: "Join the waitlist",
    line: "Event full, 12 people on the waitlist",
  },
  {
    id: "waitlist",
    label: "Waitlist",
    button: "On the waitlist",
    line: "You are #4, we will notify you",
  },
  {
    id: "closed",
    label: "Closed",
    button: "Waitlist closed",
    line: "No spots left, waitlist is closed",
  },
] as const;

type RsvpId = (typeof rsvpStates)[number]["id"];

export function RsvpDemo() {
  const [current, setCurrent] = useState<RsvpId>("open");
  const state = rsvpStates.find((item) => item.id === current) ?? rsvpStates[0];

  function press() {
    if (current === "open") setCurrent("going");
    else if (current === "full") setCurrent("waitlist");
  }

  return (
    <div className={styles.demo}>
      <div className={styles.eventCard}>
        <p className="t-mono-tag">FRI OCT 10 / 7:00 PM</p>
        <p className="t-heading-h4">Fall Fest Live: Indie Night</p>
        <p className={`${styles.small} t-body-s`}>Main Quad Stage</p>
      </div>
      <div className={styles.rsvpBar} data-state={current}>
        <button
          type="button"
          className={styles.rsvpButton}
          data-state={current}
          disabled={current === "going" || current === "waitlist" || current === "closed"}
          onClick={press}
        >
          {state.button}
        </button>
        <p className="t-body-s" role="status" aria-live="polite">
          {state.line}
        </p>
      </div>
      <div className={styles.segmented} role="radiogroup" aria-label="Event state">
        {rsvpStates.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === current}
            className={`${styles.seg} t-mono-small`}
            data-active={item.id === current ? "true" : undefined}
            onClick={() => setCurrent(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
