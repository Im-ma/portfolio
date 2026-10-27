"use client";

import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { site, talkCopy } from "@/lib/content";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./talk-panel.module.css";
import { useTalk, type TalkView } from "./talk-provider";

const CalEmbed = dynamic(() => import("./cal-embed").then((mod) => mod.CalEmbed), {
  ssr: false,
  loading: () => <p className={`${styles.standin} t-body-m`}>Loading the calendar.</p>,
});

const NOTE_SUCCESS = "Thanks. Your note will show up after I approve it.";
const QUESTION_SUCCESS = "Sent. I will reply to your email soon.";
const UNCONFIGURED_FALLBACK = "Thanks! If you don't hear back, email me at";

function SuccessMessage({ kind, configured }: { kind: "note" | "question"; configured: boolean }) {
  if (!configured && process.env.NODE_ENV !== "production") {
    return (
      <p className={`${styles.success} t-body-m`} role="status">
        {kind === "note"
          ? "Not stored (dev): connect Supabase to store notes."
          : "Not sent (dev): connect Resend to deliver questions."}
      </p>
    );
  }
  if (!configured) {
    return (
      <p className={`${styles.success} t-body-m`} role="status">
        {UNCONFIGURED_FALLBACK} <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    );
  }
  return (
    <p className={`${styles.success} t-body-m`} role="status">
      {kind === "note" ? NOTE_SUCCESS : QUESTION_SUCCESS}
    </p>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      className={`${styles.close} t-mono-small`}
      data-cursor="close"
      onClick={onClose}
    >
      {site.talkButton.closeLabel}
    </button>
  );
}

function focusable(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>("a, button, input, textarea, select")].filter(
    (node) => !node.hasAttribute("disabled") && node.tabIndex !== -1 && node.offsetParent !== null,
  );
}

export function TalkPanel() {
  const { open, view, quote, label, closeTalk, back, openTalk, clearQuote } = useTalk();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const node = panelRef.current;
    if (!node) return;
    const frame = requestAnimationFrame(() => {
      const items = focusable(node);
      (items[0] ?? node).focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, view]);

  if (!open) return null;

  const trap = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const node = panelRef.current;
    if (!node) return;
    const items = focusable(node);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    dragStart.current = event.clientY;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (dragStart.current == null) return;
    if (event.clientY - dragStart.current > 80) closeTalk();
    dragStart.current = null;
  };

  return (
    <>
      <button
        type="button"
        className={styles.overlay}
        data-cursor="close"
        aria-label="Close"
        onClick={closeTalk}
      />
      <motion.div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-talk-dialog=""
        tabIndex={-1}
        onKeyDown={trap}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div
          className={styles.handle}
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
        {view === "menu" ? (
          <Menu titleId={titleId} label={label} onClose={closeTalk} onOpen={openTalk} />
        ) : (
          <StateView
            titleId={titleId}
            view={view}
            quote={quote}
            onBack={back}
            onClose={closeTalk}
            onOpen={openTalk}
            onClearQuote={clearQuote}
          />
        )}
      </motion.div>
    </>
  );
}

function Menu({
  titleId,
  label,
  onClose,
  onOpen,
}: {
  titleId: string;
  label: string;
  onClose: () => void;
  onOpen: (action?: string) => void;
}) {
  return (
    <>
      <header className={styles.head}>
        <p className={`${styles.online} t-mono-tag`}>
          <span className={styles.dot} aria-hidden="true" />
          {talkCopy.statusLabel}
        </p>
        <h2 id={titleId} className="t-heading-h3">
          {label}
        </h2>
        <p className={`${styles.sub} t-body-s`}>{talkCopy.subtitle}</p>
        <CloseButton onClose={onClose} />
      </header>
      <div>
        {talkCopy.options.map((option) => (
          <button
            key={option.state}
            type="button"
            className={styles.option}
            onClick={() =>
              onOpen(
                option.state === "note"
                  ? "talk:note"
                  : option.state === "question"
                    ? "talk:question"
                    : "talk:book",
              )
            }
          >
            <span className={`${styles.num} t-mono-number`}>{option.number}</span>
            <span>
              <span className="t-body-m-strong">{option.title}</span>
              <span className={`${styles.desc} t-mono-small`}>{option.description}</span>
            </span>
            <span className={`${styles.arrow} t-mono-number`} aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
      <footer className={styles.foot}>
        <span className="t-mono-small">
          {talkCopy.footer.replyTime.text}
          {talkCopy.footer.replyTime.check ? (
            <Check note={talkCopy.footer.replyTime.checkNote} />
          ) : null}
        </span>
        <span className="t-mono-small">{talkCopy.footer.shortcut}</span>
      </footer>
    </>
  );
}

function StateView({
  titleId,
  view,
  quote,
  onBack,
  onClose,
  onOpen,
  onClearQuote,
}: {
  titleId: string;
  view: Exclude<TalkView, "menu">;
  quote: { text: string; source: string } | null;
  onBack: () => void;
  onClose: () => void;
  onOpen: (action?: string) => void;
  onClearQuote: () => void;
}) {
  const state = talkCopy.states[view];
  const step = view === "note" ? "01" : view === "question" ? "02" : "03";
  return (
    <>
      <header className={styles.head}>
        <div className={styles.backRow}>
          <button type="button" className={`${styles.back} t-mono-small`} onClick={onBack}>
            {state.back}
          </button>
          <span className={`${styles.step} t-mono-small`}>/ {step}</span>
        </div>
        <h2 id={titleId} className="t-heading-h3">
          {state.title}
        </h2>
        <p className={`${styles.sub} t-body-s`}>{state.subtitle}</p>
        <CloseButton onClose={onClose} />
      </header>
      {view === "note" ? <NoteForm /> : null}
      {view === "question" ? <QuestionForm quote={quote} onClearQuote={onClearQuote} /> : null}
      {view === "book" ? <BookPane onWrite={() => onOpen("talk:question")} /> : null}
    </>
  );
}

function NoteForm() {
  const note = talkCopy.states.note;
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [company, setCompany] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<boolean | null>(null);
  const max = note.counter.max;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !body.trim()) {
      setError("Add your name and a note.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, note: body, page: window.location.pathname, company }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        configured?: boolean;
      };
      if (!response.ok || !data.ok) {
        setError(data.error || "That did not go through. Try again in a moment.");
        return;
      }
      setDone(data.configured !== false);
    } catch {
      setError("That did not go through. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  if (done !== null) {
    return (
      <div className={styles.form}>
        <SuccessMessage kind="note" configured={done} />
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.honey} aria-hidden="true">
        <label>
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <div className={styles.field}>
        <label className="t-mono-label" htmlFor="note-name">
          {note.fields[0].label}
        </label>
        <input
          id="note-name"
          className={`${styles.input} t-body-s`}
          maxLength={note.fields[0].maxLength}
          placeholder={note.fields[0].placeholder}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <label className="t-mono-label" htmlFor="note-body">
          {note.fields[1].label}
        </label>
        <textarea
          id="note-body"
          className={`${styles.textarea} t-body-s`}
          maxLength={max}
          placeholder={note.fields[1].placeholder}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
        />
        <p className={`${styles.counter} t-mono-small`}>
          {note.counter.format.replace("{n}", String(body.length))}
          {note.counter.check ? <Check note={note.counter.checkNote} /> : null}
        </p>
      </div>
      {error ? (
        <p className={`${styles.error} t-body-s`} role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" arrow={note.submit.arrow} disabled={pending} full>
        {pending ? "Sending" : note.submit.label}
      </Button>
      <p className={`${styles.helper} t-mono-small`}>
        <span className={styles.dot} aria-hidden="true" />
        {note.helper}
      </p>
    </form>
  );
}

function QuestionForm({
  quote,
  onClearQuote,
}: {
  quote: { text: string; source: string } | null;
  onClearQuote: () => void;
}) {
  const copy = talkCopy.states.question;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<boolean | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !question.trim()) {
      setError("Add your name, email, and question.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          question,
          quote: quote?.text,
          source: quote?.source,
          company,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        configured?: boolean;
      };
      if (!response.ok || !data.ok) {
        setError(data.error || "That did not go through. Try again in a moment.");
        return;
      }
      setDone(data.configured !== false);
    } catch {
      setError("That did not go through. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  if (done !== null) {
    return (
      <div className={styles.form}>
        <SuccessMessage kind="question" configured={done} />
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.honey} aria-hidden="true">
        <label>
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      {quote ? (
        <blockquote className={styles.quote}>
          <span className={`${styles.quoteLabel} t-mono-tag`}>
            QUOTED FROM {quote.source.toUpperCase()}
          </span>
          <p className="t-body-s">{quote.text}</p>
          <button
            type="button"
            className={styles.remove}
            onClick={onClearQuote}
            aria-label="Remove quote"
          >
            ×
          </button>
        </blockquote>
      ) : null}
      <div className={styles.field}>
        <label className="t-mono-label" htmlFor="q-name">
          {copy.fields[0].label}
        </label>
        <input
          id="q-name"
          className={`${styles.input} t-body-s`}
          placeholder={copy.fields[0].placeholder}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <label className="t-mono-label" htmlFor="q-email">
          {copy.fields[1].label}
        </label>
        <input
          id="q-email"
          type="email"
          className={`${styles.input} t-body-s`}
          placeholder={copy.fields[1].placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <label className="t-mono-label" htmlFor="q-body">
          {copy.fields[2].label}
        </label>
        <textarea
          id="q-body"
          className={`${styles.textarea} t-body-s`}
          maxLength={copy.fields[2].maxLength}
          placeholder={copy.fields[2].placeholder}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          required
        />
      </div>
      {error ? (
        <p className={`${styles.error} t-body-s`} role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" arrow={copy.submit.arrow} disabled={pending} full>
        {pending ? "Sending" : copy.submit.label}
      </Button>
    </form>
  );
}

function BookPane({ onWrite }: { onWrite: () => void }) {
  const copy = talkCopy.states.book;
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK;
  return (
    <div>
      <p className="sr-only">
        The calendar is a separate page. Escape does not close this panel from inside it. Use Close
        in the header.
      </p>
      <div className={styles.embed}>
        {calLink ? (
          <CalEmbed calLink={calLink} />
        ) : (
          <div className={styles.standin}>
            <p className="t-heading-h4">{copy.embedStandin[0]}</p>
            <p className="t-mono-small" aria-hidden="true">
              {copy.embedStandin[1]}
            </p>
            <div className={styles.times} aria-hidden="true">
              {copy.embedStandin.slice(2, 5).map((time) => (
                <span key={time} className={`${styles.time} t-body-s`}>
                  {time}
                </span>
              ))}
            </div>
            <p className="t-body-m">Booking opens soon</p>
            <p className="t-mono-small">
              {copy.embedStandin[5]}
              <Check note="Cal.com link" />
            </p>
          </div>
        )}
      </div>
      <button type="button" className={`${styles.switch} t-body-s`} onClick={onWrite}>
        {copy.switchLink.label} <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
