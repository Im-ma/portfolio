"use client";

import { talkLabelForPath } from "@/lib/content";
import { lockScroll } from "@/lib/scroll-lock";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type TalkView = "menu" | "note" | "question" | "book";
export type TalkQuote = { text: string; source: string };

type OpenOptions = { quote?: string; source?: string };

type TalkContextValue = {
  open: boolean;
  view: TalkView;
  quote: TalkQuote | null;
  label: string;
  openTalk: (action?: string, options?: OpenOptions) => void;
  closeTalk: () => void;
  back: () => void;
  clearQuote: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
};

const TalkContext = createContext<TalkContextValue | null>(null);

function viewFromAction(action?: string): TalkView {
  if (action === "talk:note") return "note";
  if (action === "talk:question") return "question";
  if (action === "talk:book") return "book";
  return "menu";
}

export function readAskSelection() {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(pointer: coarse)").matches) return null;
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;
  const text = selection.toString().replace(/\s+/g, " ").trim();
  if (text.length < 5 || text.length > 400) return null;
  const node = selection.anchorNode;
  const element = node instanceof Element ? node : node?.parentElement;
  const root = element?.closest("[data-ask-root]");
  if (!root) return null;
  const source = root.getAttribute("data-ask-source") || "this page";
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  return { text, source, rect };
}

export function TalkProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const label = talkLabelForPath(pathname);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<TalkView>("menu");
  const [quote, setQuote] = useState<TalkQuote | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const closeTalk = useCallback(() => {
    setOpen(false);
    setView("menu");
    const target = returnFocus.current ?? buttonRef.current;
    requestAnimationFrame(() => target?.focus());
  }, []);

  const openTalk = useCallback((action?: string, options?: OpenOptions) => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const next = viewFromAction(action);
    setView(next);
    if (options?.quote) {
      setQuote({ text: options.quote, source: options.source || "this page" });
    } else if (next !== "question") {
      setQuote(null);
    }
    setOpen(true);
  }, []);

  const back = useCallback(() => setView("menu"), []);
  const clearQuote = useCallback(() => setQuote(null), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!open) return;
        event.preventDefault();
        if (view !== "menu") {
          setView("menu");
          return;
        }
        closeTalk();
        return;
      }
      if (event.key !== "t" && event.key !== "T") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) {
          return;
        }
      }
      const ask = readAskSelection();
      if (ask) {
        if (!open) {
          event.preventDefault();
          openTalk("talk:question", { quote: ask.text, source: ask.source });
        }
        return;
      }
      event.preventDefault();
      if (open) closeTalk();
      else openTalk("talk:open");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeTalk, open, openTalk, view]);

  useEffect(() => {
    if (!open) return;
    const release = lockScroll();
    const background = [
      document.querySelector("header"),
      document.getElementById("content"),
      document.querySelector("[data-talk-launcher]"),
    ].filter((node): node is HTMLElement => node instanceof HTMLElement);
    background.forEach((node) => node.setAttribute("inert", ""));
    return () => {
      release();
      background.forEach((node) => node.removeAttribute("inert"));
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, view, quote, label, openTalk, closeTalk, back, clearQuote, buttonRef }),
    [open, view, quote, label, openTalk, closeTalk, back, clearQuote],
  );

  return <TalkContext.Provider value={value}>{children}</TalkContext.Provider>;
}

export function useTalk() {
  const value = useContext(TalkContext);
  if (!value) throw new Error("useTalk must be used inside TalkProvider");
  return value;
}
