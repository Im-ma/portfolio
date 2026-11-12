"use client";

import { lockScroll } from "@/lib/scroll-lock";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./resume-modal.module.css";

const pdf = "/resume.pdf";

type OpenResume = (trigger: HTMLElement | null, pointer: boolean) => void;

const ResumeContext = createContext<OpenResume>(() => {});

export function useOpenResume() {
  return useContext(ResumeContext);
}

function focusable(root: HTMLElement) {
  return [
    ...root.querySelectorAll<HTMLElement>("a, button, iframe, input, textarea, select"),
  ].filter(
    (node) => !node.hasAttribute("disabled") && node.tabIndex !== -1 && node.offsetParent !== null,
  );
}

function isResumeLink(node: Element | null) {
  const link = node?.closest("a");
  if (!link) return false;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:")) return false;
  const path = href.split("?")[0]?.split("#")[0];
  return path === "/resume";
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const pointerOpen = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);
  const openResume = useCallback<OpenResume>((next, pointer) => {
    trigger.current = next;
    pointerOpen.current = pointer;
    setOpen(true);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!isResumeLink(target)) return;
      event.preventDefault();
      const link = target?.closest("a");
      openResume(link instanceof HTMLElement ? link : null, event.detail > 0);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openResume]);

  useEffect(() => {
    if (!open) return;
    const previous = trigger.current;
    const fromPointer = pointerOpen.current;
    const release = lockScroll();
    const root = document.querySelector("[data-resume-root]");
    const background = [...document.body.children].filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node !== root,
    );
    background.forEach((node) => node.setAttribute("inert", ""));
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      release();
      window.removeEventListener("keydown", onKey);
      background.forEach((node) => node.removeAttribute("inert"));
      const menu = document.querySelector<HTMLElement>("header button[aria-controls]");
      const target = previous?.isConnected ? previous : menu;
      const options: FocusOptions = { preventScroll: true };
      if (fromPointer) Object.assign(options, { focusVisible: false });
      target?.focus(options);
    };
  }, [open]);

  const trap = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const node = dialogRef.current;
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

  const dialog =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className={styles.backdrop} data-resume-root data-cursor="close" onMouseDown={close}>
            <div
              ref={dialogRef}
              className={styles.dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              data-resume-dialog=""
              tabIndex={-1}
              onMouseDown={(event) => event.stopPropagation()}
              onKeyDown={trap}
            >
              <div className={styles.bar}>
                <h2 id={titleId} className={styles.title}>
                  Resume
                </h2>
                <a className={styles.download} href={pdf} download>
                  Download PDF
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  className={styles.close}
                  data-cursor="close"
                  onClick={close}
                >
                  Close
                </button>
              </div>
              <div className={styles.stage}>
                <iframe
                  className={styles.frame}
                  src={`${pdf}#toolbar=0&navpanes=0&view=FitH`}
                  title="Resume of Immanuel Mensah"
                />
              </div>
              <div className={styles.fallback}>
                <p className={`${styles.kicker} t-mono-label`}>PDF</p>
                <p className="t-heading-h3">Immanuel Mensah</p>
                <p className={`${styles.note} t-body-m`}>
                  Download the PDF to read it on your phone.
                </p>
                <a className={styles.download} href={pdf} download>
                  Download PDF
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <ResumeContext.Provider value={openResume}>
      {children}
      {dialog}
    </ResumeContext.Provider>
  );
}
