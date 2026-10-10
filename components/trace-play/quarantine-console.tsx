"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { recordJson, sampleRecords, type SampleRecord } from "./sample-data";
import styles from "./trace-play.module.css";
import { TryIt } from "./try-it";

type Phase = "active" | "quarantined" | "deleted";
type StatusFilter = "all" | "passed" | "invalid" | "warning" | "quarantined";

const filters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "passed", label: "Passed" },
  { id: "invalid", label: "Invalid" },
  { id: "warning", label: "Warnings" },
  { id: "quarantined", label: "Quarantined" },
];

const issues = [
  "all",
  "missing label",
  "invalid dimensions",
  "duplicate",
  "low resolution",
] as const;
const splits = ["all", "train", "validation", "test"] as const;

type Row = SampleRecord & { phase: Phase };

function phaseOf(phases: Record<string, Phase>, id: string): Phase {
  return phases[id] ?? "active";
}

export function QuarantineConsole() {
  const searchId = useId();
  const issueId = useId();
  const splitId = useId();
  const [phases, setPhases] = useState<Record<string, Phase>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [issue, setIssue] = useState<(typeof issues)[number]>("all");
  const [split, setSplit] = useState<(typeof splits)[number]>("all");
  const [query, setQuery] = useState("");
  const [inspected, setInspected] = useState("rec_demo_03");
  const [note, setNote] = useState<{ text: string; tone: "risk" | "hold" | "plain" }>({
    text: "",
    tone: "plain",
  });
  const [validating, setValidating] = useState(false);
  const run = useRef(0);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const allRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      run.current += 1;
    };
  }, []);

  const rows: Row[] = sampleRecords.map((record) => ({
    ...record,
    phase: phaseOf(phases, record.id),
  }));
  const active = rows.filter((row) => row.phase === "active");
  const held = rows.filter((row) => row.phase === "quarantined");
  const counts = {
    total: active.length + held.length,
    passed: active.filter((row) => row.status === "passed").length,
    invalid: active.filter((row) => row.status === "invalid").length,
    warning: active.filter((row) => row.status === "warning").length,
    quarantined: held.length,
  };

  const visible = rows.filter((row) => {
    if (row.phase === "deleted") return false;
    if (filter === "quarantined") {
      if (row.phase !== "quarantined") return false;
    } else if (row.phase === "quarantined") {
      return false;
    } else if (filter !== "all" && row.status !== filter) {
      return false;
    }
    if (issue !== "all" && row.issue !== issue) return false;
    if (split !== "all" && row.split !== split) return false;
    const haystack = `${row.id} ${row.file} ${row.issue}`.toLowerCase();
    if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const visibleIds = visible.map((row) => row.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const someSelected = visibleIds.some((id) => selected.includes(id));

  useEffect(() => {
    if (!allRef.current) return;
    allRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  const selectedRows = rows.filter((row) => selected.includes(row.id) && row.phase !== "deleted");
  const canQuarantine = selectedRows.some((row) => row.phase === "active");
  const canDelete = canQuarantine;
  const canRestore = selectedRows.some((row) => row.phase === "quarantined");
  const current = rows.find((row) => row.id === inspected) ?? null;
  const tabId = visible.some((row) => row.id === inspected) ? inspected : visible[0]?.id;

  function reset() {
    run.current += 1;
    setPhases({});
    setSelected([]);
    setFilter("all");
    setIssue("all");
    setSplit("all");
    setQuery("");
    setInspected("rec_demo_03");
    setNote({ text: "", tone: "plain" });
    setValidating(false);
  }

  function toggle(id: string) {
    if (validating) return;
    setSelected((currentIds) =>
      currentIds.includes(id) ? currentIds.filter((item) => item !== id) : [...currentIds, id],
    );
  }

  function toggleVisible() {
    if (validating) return;
    setSelected((currentIds) =>
      allSelected
        ? currentIds.filter((id) => !visibleIds.includes(id))
        : [...new Set([...currentIds, ...visibleIds])],
    );
  }

  function move(id: string, direction: 1 | -1) {
    const index = visible.findIndex((row) => row.id === id);
    const next = visible[index + direction];
    if (!next) return;
    setInspected(next.id);
    rowRefs.current[next.id]?.focus();
  }

  function jump(id: string) {
    setInspected(id);
    rowRefs.current[id]?.focus();
  }

  function onRowKey(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    if (validating) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(id, 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(id, -1);
    } else if (event.key === "Home" && visible[0]) {
      event.preventDefault();
      jump(visible[0].id);
    } else if (event.key === "End" && visible.length) {
      event.preventDefault();
      jump(visible[visible.length - 1].id);
    } else if (event.key === " ") {
      event.preventDefault();
      toggle(id);
    }
  }

  function quarantine(ids: string[]) {
    const targets = ids.filter((id) => phaseOf(phases, id) === "active");
    if (!targets.length) return;
    setPhases((currentPhases) => {
      const next = { ...currentPhases };
      for (const id of targets) next[id] = "quarantined";
      return next;
    });
    setFilter("quarantined");
    setInspected(targets[0]);
    setNote({
      text:
        targets.length === 1
          ? "This record is held aside. Its original data has been preserved."
          : "These records are held aside. Their original data has been preserved.",
      tone: "hold",
    });
  }

  function remove(ids: string[]) {
    const targets = ids.filter((id) => phaseOf(phases, id) === "active");
    if (!targets.length) return;
    setPhases((currentPhases) => {
      const next = { ...currentPhases };
      for (const id of targets) next[id] = "deleted";
      return next;
    });
    setSelected((currentIds) => currentIds.filter((id) => !targets.includes(id)));
    if (targets.includes(inspected)) {
      const nextVisible = visible.find((row) => !targets.includes(row.id));
      setInspected(nextVisible?.id ?? "");
    }
    setNote({
      text: `Deleting destroys evidence. You can't audit it later, and you can't undo a mistake made under pressure. Deleted: ${targets.join(", ")}.`,
      tone: "risk",
    });
  }

  function finishRestore(ids: string[]) {
    const targets = ids.filter((id) => phaseOf(phases, id) === "quarantined");
    if (!targets.length) return;
    setPhases((currentPhases) => {
      const next = { ...currentPhases };
      for (const id of targets) delete next[id];
      return next;
    });
    setFilter("all");
    const still = targets.filter(
      (id) => sampleRecords.find((row) => row.id === id)?.status === "invalid",
    );
    if (still.length) {
      setInspected(still[0]);
      setNote({
        text:
          still.length === 1
            ? "Restored record still blocks the batch. Trace doesn't just trust you. It reruns validation, and the record is flagged again."
            : "Restored records still block the batch. Trace doesn't just trust you. It reruns validation, and the records are flagged again.",
        tone: "risk",
      });
    } else {
      setInspected(targets[0]);
      setNote({ text: "Trace doesn't just trust you. It reruns validation.", tone: "plain" });
    }
  }

  function restore(ids: string[]) {
    const targets = ids.filter((id) => phaseOf(phases, id) === "quarantined");
    if (!targets.length || validating) return;
    const token = run.current + 1;
    run.current = token;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      finishRestore(targets);
      return;
    }
    setValidating(true);
    setNote({
      text: "While validation runs, rows, filters, and actions are disabled so you can't act on data mid-check.",
      tone: "plain",
    });
    window.setTimeout(() => {
      if (run.current !== token) return;
      setValidating(false);
      finishRestore(targets);
    }, 700);
  }

  const kpis: { id: StatusFilter; label: string; value: number }[] = [
    { id: "all", label: "Total", value: counts.total },
    { id: "passed", label: "Passed", value: counts.passed },
    { id: "invalid", label: "Invalid", value: counts.invalid },
    { id: "warning", label: "Warnings", value: counts.warning },
    { id: "quarantined", label: "Quarantined", value: counts.quarantined },
  ];

  return (
    <TryIt
      id="play-decision-1"
      label="Try it: quarantine or delete"
      hint="Filter the invalid records, select them, then choose Delete or Quarantine."
      onReset={reset}
    >
      <div className={styles.workbench} data-locked={validating ? "true" : undefined}>
        <div className={styles.consoleTop}>
          <p className={`${styles.sample} t-mono-tag`}>Sample data</p>
          <p className={`${styles.hint} t-body-xs`}>Counts are for this sample only.</p>
          {held.length > 0 ? (
            <p className={`${styles.badge} t-mono-tag`}>Revalidation needed</p>
          ) : null}
        </div>
        <div className={styles.kpis}>
          {kpis.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.kpi}
              aria-pressed={filter === item.id}
              disabled={validating}
              onClick={() => setFilter(item.id)}
            >
              <strong>{item.value}</strong>
              <span className="t-mono-tag">{item.label}</span>
            </button>
          ))}
        </div>
        {validating ? (
          <div
            className={styles.bar}
            role="progressbar"
            aria-label="Validation running"
            aria-valuetext="Validation running"
          >
            <span />
          </div>
        ) : null}
        <div className={styles.toolbar}>
          <input
            id={searchId}
            className={styles.search}
            type="search"
            value={query}
            placeholder="Search by ID, file, or issue"
            aria-label="Search by ID, file, or issue"
            disabled={validating}
            onChange={(event) => setQuery(event.target.value)}
          />
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.chip}
              aria-pressed={filter === item.id}
              disabled={validating}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
          <label className={`${styles.field} ${styles.extraFilters}`} htmlFor={issueId}>
            <span className={styles.fieldLabel}>Issue</span>
            <select
              id={issueId}
              className={styles.select}
              value={issue}
              disabled={validating}
              onChange={(event) => setIssue(event.target.value as (typeof issues)[number])}
            >
              {issues.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "Any issue" : item}
                </option>
              ))}
            </select>
          </label>
          <label className={`${styles.field} ${styles.extraFilters}`} htmlFor={splitId}>
            <span className={styles.fieldLabel}>Split</span>
            <select
              id={splitId}
              className={styles.select}
              value={split}
              disabled={validating}
              onChange={(event) => setSplit(event.target.value as (typeof splits)[number])}
            >
              {splits.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "Any split" : item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className={`${styles.hint} t-body-xs`}>
          Arrows move the highlighted row. Space selects. Enter inspects. Clicking a row does not
          select it.
        </p>
        <div className={styles.layout}>
          <div className={styles.tableCard}>
            <div className={styles.columns}>
              <label className={styles.check}>
                <input
                  ref={allRef}
                  type="checkbox"
                  checked={allSelected}
                  disabled={validating || visibleIds.length === 0}
                  aria-label="Select these records"
                  onChange={toggleVisible}
                />
              </label>
              <span className={styles.columnLabels}>
                <span>ID</span>
                <span>File</span>
                <span>Status</span>
                <span>Issue</span>
                <span>Split</span>
              </span>
            </div>
            {visible.length === 0 ? (
              <p className={styles.empty}>Empty results</p>
            ) : (
              <ul className={styles.records}>
                {visible.map((row) => {
                  const status = row.phase === "quarantined" ? "quarantined" : row.status;
                  const pill =
                    status === "passed"
                      ? styles.passed
                      : status === "invalid"
                        ? styles.invalid
                        : status === "warning"
                          ? styles.warning
                          : styles.quarantined;
                  return (
                    <li key={row.id} className={styles.record}>
                      <label className={styles.check}>
                        <input
                          type="checkbox"
                          checked={selected.includes(row.id)}
                          disabled={validating}
                          aria-label={`Select ${row.id}`}
                          onChange={() => toggle(row.id)}
                        />
                      </label>
                      <button
                        type="button"
                        className={styles.recordButton}
                        aria-pressed={inspected === row.id}
                        tabIndex={row.id === tabId ? 0 : -1}
                        disabled={validating}
                        ref={(node) => {
                          rowRefs.current[row.id] = node;
                        }}
                        onClick={() => setInspected(row.id)}
                        onKeyDown={(event) => onRowKey(event, row.id)}
                      >
                        <span className={styles.id}>{row.id}</span>
                        <span className={styles.file}>{row.file}</span>
                        <span className={`${styles.pill} ${pill}`}>{status}</span>
                        <span className={styles.issue}>
                          {row.issue === "none" ? "None" : row.issue}
                        </span>
                        <span className={styles.split}>{row.split}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <Inspector row={current} />
        </div>
        <div className={styles.bulk}>
          <p className="t-body-s" aria-hidden="true">
            {selectedRows.length} selected · Delete · Quarantine · Restore · Clear selection
          </p>
          <div className={styles.bulkActions}>
            <button
              type="button"
              className={styles.btn}
              disabled={!canDelete || validating}
              onClick={() => remove(selected)}
            >
              Delete
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              disabled={!canQuarantine || validating}
              onClick={() => quarantine(selected)}
            >
              Quarantine
            </button>
            <button
              type="button"
              className={styles.btn}
              disabled={!canRestore || validating}
              onClick={() => restore(selected)}
            >
              Restore
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.quiet}`}
              disabled={selected.length === 0 || validating}
              onClick={() => setSelected([])}
            >
              Clear selection
            </button>
          </div>
        </div>
        {selectedRows.length > 0 && !canRestore ? (
          <p className={`${styles.hint} t-body-s`}>
            Restore stays disabled because nothing selected is quarantined yet.
          </p>
        ) : null}
        {selectedRows.length > 0 && !canDelete && canRestore ? (
          <p className={`${styles.hint} t-body-s`}>
            Quarantine keeps the source record. Delete is not available once it is held aside.
          </p>
        ) : null}
        <section className={styles.tray} aria-label="Quarantine">
          <h4 className="t-heading-h4">Quarantine</h4>
          <p className={`${styles.muted} t-body-s`}>
            Move it aside (&quot;quarantine&quot;) so it&apos;s excluded from training but kept
            exactly as it was.
          </p>
          {held.length === 0 ? (
            <p className={styles.empty}>Nothing is held aside yet.</p>
          ) : (
            held.map((row) => (
              <article key={row.id} className={styles.held}>
                <div className={styles.heldHead}>
                  <p className={styles.id}>{row.id}</p>
                  <button
                    type="button"
                    className={styles.btn}
                    disabled={validating}
                    onClick={() => restore([row.id])}
                  >
                    Restore
                  </button>
                </div>
                <p className="t-body-s">{row.plain}</p>
                <pre className={styles.json}>{recordJson(row)}</pre>
              </article>
            ))
          )}
        </section>
        {note.text ? (
          <p
            className={
              note.tone === "risk" ? styles.risk : note.tone === "hold" ? styles.hold : styles.note
            }
            role="status"
          >
            {note.text}
          </p>
        ) : null}
      </div>
    </TryIt>
  );
}

function Inspector({ row }: { row: Row | null }) {
  if (!row || row.phase === "deleted") {
    return (
      <aside className={styles.inspector} aria-label="Sample record inspector">
        <h4 className="t-heading-h4">Inspector</h4>
        <p className={`${styles.muted} t-body-s`}>
          {row?.phase === "deleted"
            ? "That record is gone. There is nothing left to inspect."
            : "Select a record to inspect it."}
        </p>
      </aside>
    );
  }

  return (
    <aside className={styles.inspector} aria-label="Sample record inspector">
      <h4 className="t-heading-h4">Inspector</h4>
      <p className={styles.id}>{row.id}</p>
      {row.phase === "quarantined" ? (
        <p className={`${styles.hold} t-body-s`}>
          This record is held aside. Its original data has been preserved.
        </p>
      ) : null}
      <p className="t-body-s">{row.plain}</p>
      {row.rule ? <p className={`${styles.muted} t-mono-small`}>Rule {row.rule}</p> : null}
      <p className={`${styles.fieldLabel}`}>Raw JSON</p>
      <pre className={styles.json}>{recordJson(row)}</pre>
    </aside>
  );
}
