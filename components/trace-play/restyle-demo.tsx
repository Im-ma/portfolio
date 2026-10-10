"use client";

import { useId, useState } from "react";
import styles from "./trace-play.module.css";
import { TryIt } from "./try-it";

const labRecords = [
  { id: "rec_demo_03", issue: "missing label" },
  { id: "rec_demo_05", issue: "invalid dimensions" },
  { id: "rec_demo_01", issue: "none" },
];

export function RestyleDemo() {
  const searchId = useId();
  const [value, setValue] = useState(48);
  const [greenAs, setGreenAs] = useState<"text" | "surface">("text");
  const [tab, setTab] = useState<"inspector" | "assistant">("inspector");
  const [invalidOn, setInvalidOn] = useState(true);
  const [query, setQuery] = useState("");
  const [filterNote, setFilterNote] = useState(
    "Clicking the tab or row you're already on does nothing, so your filters are kept when you move between the inspector and the assistant.",
  );

  function reset() {
    setValue(48);
    setGreenAs("text");
    setTab("inspector");
    setInvalidOn(true);
    setQuery("");
    setFilterNote(
      "Clicking the tab or row you're already on does nothing, so your filters are kept when you move between the inspector and the assistant.",
    );
  }

  function selectTab(next: "inspector" | "assistant") {
    if (next === tab) {
      setFilterNote(
        "Clicking the tab or row you're already on does nothing, so your filters are kept when you move between the inspector and the assistant.",
      );
      return;
    }
    setTab(next);
    setFilterNote("Your filters are kept when you move between the inspector and the assistant.");
  }

  const shown = labRecords.filter((record) => {
    const matchesInvalid = !invalidOn || record.issue !== "none";
    const haystack = `${record.id} ${record.issue}`.toLowerCase();
    return matchesInvalid && haystack.includes(query.trim().toLowerCase());
  });

  return (
    <TryIt
      id="play-decision-4"
      label="Try it: restyle and focus"
      hint="Drag from the first version to the restyle, then tab through the focus states."
      onReset={reset}
    >
      <p className={`${styles.sample} t-mono-tag`}>Sample data</p>
      <figure className={styles.workbench}>
        <div className={styles.stage}>
          <div className={`${styles.skin} ${styles.afterSkin}`} aria-hidden="true">
            <span className={`${styles.skinTag} ${styles.skinTagEnd}`}>After</span>
            <div className={styles.skinCard}>
              <p className={styles.brandBar}>Trace</p>
              <div className={styles.afterStats}>
                <div className={styles.afterStat}>Total</div>
                <div className={styles.afterStat}>Invalid</div>
                <div className={styles.afterStat}>Warnings</div>
              </div>
              <div className={styles.deepButton}>Quarantine</div>
              <p className={styles.skinNote}>
                A card-based dashboard with a green accent, and a 3 px focus ring.
              </p>
            </div>
          </div>
          <div
            className={`${styles.skin} ${styles.beforeSkin}`}
            style={{ clipPath: `inset(0 ${value}% 0 0)` }}
            aria-hidden="true"
          >
            <span className={`${styles.skinTag} ${styles.skinTagStart}`}>Before</span>
            <p className={styles.messyTitle}>Trace</p>
            <div className={styles.messyRow}>
              <div className={`${styles.messyTile} ${styles.tileA}`}>Total</div>
              <div className={`${styles.messyTile} ${styles.tileB}`}>Invalid</div>
              <div className={`${styles.messyTile} ${styles.tileC}`}>Warnings</div>
            </div>
            <div className={styles.messyActions}>
              <span className={styles.greenText}>Quarantine</span>
              <span className={styles.blueButton}>Validate</span>
            </div>
            <p className={styles.skinNote}>
              Colors were picked per screen. There were no focus states.
            </p>
          </div>
          <div className={styles.cut} style={{ left: `${100 - value}%` }} aria-hidden="true" />
          <input
            className={styles.range}
            type="range"
            min={0}
            max={100}
            value={value}
            aria-label="Compare before and after"
            aria-valuetext={`${value} percent toward the restyle`}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </div>
        <div className={`${styles.rangeLabels} t-mono-small`}>
          <span>Before. A set of screens, not a system.</span>
          <span>After. A card-based dashboard with a green accent.</span>
        </div>
      </figure>

      <div className={styles.lab}>
        <p className={`${styles.fieldLabel}`}>Contrast</p>
        <div className={styles.pairSwitch} role="group" aria-label="Green as text or as a surface">
          <button
            type="button"
            className={styles.chip}
            aria-pressed={greenAs === "text"}
            onClick={() => setGreenAs("text")}
          >
            Green as text
          </button>
          <button
            type="button"
            className={styles.chip}
            aria-pressed={greenAs === "surface"}
            onClick={() => setGreenAs("surface")}
          >
            Green as a surface
          </button>
        </div>
        <div className={styles.specimen}>
          {greenAs === "text" ? (
            <div className={styles.failSample} aria-hidden="true">
              Sample label
            </div>
          ) : (
            <div className={styles.surfaceSample} aria-hidden="true">
              Dark ink
            </div>
          )}
          <p className="t-body-s">
            {greenAs === "text"
              ? "Bright green (#76B900) on white is only 2.41:1, so I never use it for text."
              : "On the accent I put dark ink (8.01:1)."}
          </p>
        </div>
        <div className={styles.passing}>
          <div
            className={styles.midGreen}
            role="img"
            aria-label="White label on #4E7A00, 5.11 to 1"
          >
            #4E7A00 at 5.11:1
          </div>
          <div
            className={styles.deepGreen}
            role="img"
            aria-label="White label on #3D6100, 7.22 to 1"
          >
            #3D6100 at 7.22:1
          </div>
        </div>
        <p className={`${styles.muted} t-body-s`}>
          Buttons with white labels use darker greens. Every text pair passes WCAG AA.
        </p>
      </div>

      <div className={styles.lab}>
        <p className={`${styles.fieldLabel}`}>Focus states</p>
        <p className={`${styles.muted} t-body-s`}>
          Tab through these. Buttons, checkboxes, filters, tabs, and search all have a visible focus
          variant (a 3 px ring, 2 px on small controls). Checkboxes sit in a 24 px target.
        </p>
        <div className={styles.focusRow}>
          <button type="button" className={`${styles.btn} ${styles.primary}`}>
            Primary
          </button>
          <button type="button" className={styles.smallControl} aria-label="Small control">
            +
          </button>
          <label className={styles.check}>
            <input type="checkbox" defaultChecked aria-label="Sample checkbox" />
          </label>
          <button
            type="button"
            className={styles.chip}
            aria-pressed={invalidOn}
            onClick={() => setInvalidOn((on) => !on)}
          >
            Invalid
          </button>
          <input
            id={searchId}
            className={styles.search}
            type="search"
            value={query}
            aria-label="Search by ID, file, or issue"
            placeholder="Search by ID, file, or issue"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className={styles.tabRow} role="tablist" aria-label="Inspector and assistant">
          <button
            type="button"
            className={styles.tab}
            role="tab"
            aria-selected={tab === "inspector"}
            onClick={() => selectTab("inspector")}
          >
            Inspector
          </button>
          <button
            type="button"
            className={styles.tab}
            role="tab"
            aria-selected={tab === "assistant"}
            onClick={() => selectTab("assistant")}
          >
            Assistant
          </button>
        </div>
        <p className="t-body-s">
          {tab === "inspector" ? "Inspector" : "Assistant"}. {filterNote}
        </p>
        <ul className={styles.labList}>
          {shown.length === 0 ? (
            <li>Empty results</li>
          ) : (
            shown.map((record) => (
              <li key={record.id}>
                {record.id}
                {record.issue === "none" ? "" : ` · ${record.issue}`}
              </li>
            ))
          )}
        </ul>
      </div>
    </TryIt>
  );
}
