"use client";

import { useState } from "react";
import { recordJson, sampleRecords, type SampleIssue, type SampleRecord } from "./sample-data";
import styles from "./trace-play.module.css";
import { TryIt } from "./try-it";

type Mode = "explains" | "edits";

const groups: { issue: SampleIssue; label: string }[] = [
  { issue: "missing label", label: "Missing labels" },
  { issue: "invalid dimensions", label: "Invalid dimensions" },
  { issue: "duplicate", label: "Duplicates" },
  { issue: "low resolution", label: "Low resolution" },
];

function withGuess(record: SampleRecord): SampleRecord {
  if (record.status !== "invalid") return record;
  return {
    ...record,
    label: record.label || "guessed-demo",
    width: record.width || 1280,
    height: record.height || 720,
    status: "passed",
    issue: "none",
    rule: "",
  };
}

export function AssistantDemo() {
  const [mode, setMode] = useState<Mode>("explains");
  const [mutated, setMutated] = useState(false);
  const [stale, setStale] = useState(false);
  const [failed, setFailed] = useState(false);
  const [group, setGroup] = useState<SampleIssue | null>(null);

  function reset() {
    setMode("explains");
    setMutated(false);
    setStale(false);
    setFailed(false);
    setGroup(null);
  }

  const current = mutated ? sampleRecords.map(withGuess) : sampleRecords;
  const described = stale ? sampleRecords : current;
  const blocking = described.filter((record) => record.status === "invalid");
  const shown = described.filter((record) => (group ? record.issue === group : true));

  return (
    <TryIt
      id="play-decision-2"
      hint="Assistant explains, or assistant edits. Only one of these leaves the records alone."
      onReset={reset}
    >
      <p className={`${styles.sample} t-mono-tag`}>Sample data</p>
      <div className={styles.modes} role="group" aria-label="Assistant explains or assistant edits">
        <button
          type="button"
          className={styles.mode}
          aria-pressed={mode === "explains"}
          onClick={() => setMode("explains")}
        >
          Assistant explains
        </button>
        <button
          type="button"
          className={styles.mode}
          aria-pressed={mode === "edits"}
          onClick={() => setMode("edits")}
        >
          Assistant edits
        </button>
      </div>
      {mode === "explains" ? (
        <div className={styles.panel}>
          <p className={`${styles.simLabel} t-mono-label`}>Simulated AI · rule-based</p>
          <p className={`${styles.muted} t-body-s`}>No data is sent to an AI service.</p>
          {failed ? (
            <div className={styles.failBox}>
              <p className="t-body-s">
                The assistant failed. Your records and validation results are unchanged.
              </p>
              <ul className={styles.groupList}>
                {sampleRecords
                  .filter((record) => record.status === "invalid")
                  .map((record) => (
                    <li key={record.id}>
                      <span className={styles.id}>{record.id}</span>
                      <span className="t-body-s">
                        {record.label ? record.label : "empty label"}
                      </span>
                    </li>
                  ))}
              </ul>
              <button type="button" className={styles.btn} onClick={() => setFailed(false)}>
                Retry
              </button>
            </div>
          ) : (
            <>
              {stale ? (
                <div className={styles.stale}>
                  <p className="t-body-s">
                    When the data changes, the explanation is marked as needing a refresh instead of
                    quietly going stale.
                  </p>
                  <button type="button" className={styles.btn} onClick={() => setStale(false)}>
                    Refresh
                  </button>
                </div>
              ) : null}
              <p className="t-body-m">
                {blocking.length === 1
                  ? "1 record is blocking this sample."
                  : `${blocking.length} records are blocking this sample.`}
              </p>
              <div className={styles.groups}>
                {groups.map((item) => {
                  const count = described.filter((record) => record.issue === item.issue).length;
                  if (!count) return null;
                  return (
                    <button
                      key={item.issue}
                      type="button"
                      className={styles.chip}
                      aria-pressed={group === item.issue}
                      onClick={() =>
                        setGroup((currentGroup) =>
                          currentGroup === item.issue ? null : item.issue,
                        )
                      }
                    >
                      {count} {item.label}
                    </button>
                  );
                })}
              </div>
              <ul className={styles.groupList}>
                {shown.map((record) => (
                  <li key={record.id}>
                    <span className={styles.id}>{record.id}</span>
                    <span className={`${styles.muted} t-body-s`}>
                      {record.label ? `label ${record.label}` : "empty label"}
                      {record.issue === "none" ? "" : ` · ${record.issue}`}
                    </span>
                  </li>
                ))}
              </ul>
              {!mutated ? (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.quiet}`}
                  onClick={() => setFailed(true)}
                >
                  Show the failure
                </button>
              ) : (
                <p className={`${styles.muted} t-body-s`}>
                  The guessed values are still in the sample. Reset puts the original data back.
                </p>
              )}
            </>
          )}
          <p className={`${styles.footerNote} t-body-s`}>
            AI suggestions never change records automatically.
          </p>
        </div>
      ) : (
        <div className={styles.panel}>
          <p className="t-body-m">An auto-fix button that applies suggested changes.</p>
          <button
            type="button"
            className={styles.btn}
            disabled={mutated}
            onClick={() => {
              setMutated(true);
              setStale(true);
              setFailed(false);
            }}
          >
            Fix the batch
          </button>
          {mutated ? (
            <>
              <p className={`${styles.risk} t-body-s`} role="status">
                An assistant that can &quot;fix the batch&quot; sounds great in a demo. But in a
                training pipeline, a confident wrong fix is worse than no fix, because nobody
                notices it.
              </p>
              <div className={styles.groupList}>
                {sampleRecords
                  .filter((record) => record.status === "invalid")
                  .map((record) => {
                    const next = withGuess(record);
                    return (
                      <article key={record.id} className={styles.diff}>
                        <p className={styles.id}>{record.id}</p>
                        <p className={`${styles.muted} t-body-xs`}>Original</p>
                        <pre className={styles.json}>{recordJson(record)}</pre>
                        <p className={`${styles.muted} t-body-xs`}>After the auto-fix</p>
                        <pre className={styles.json}>{recordJson(next)}</pre>
                      </article>
                    );
                  })}
              </div>
              <p className="t-body-s">AI suggestions never mutate data.</p>
            </>
          ) : (
            <p className={`${styles.muted} t-body-s`}>
              An explanation with evidence keeps every action in the person&apos;s hands. This
              button does not.
            </p>
          )}
        </div>
      )}
    </TryIt>
  );
}
