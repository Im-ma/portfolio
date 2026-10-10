"use client";

import { lockScroll } from "@/lib/scroll-lock";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import styles from "./lightbox.module.css";

export function Lightbox({
  open,
  src,
  alt,
  caption,
  onClose,
}: {
  open: boolean;
  src?: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
      }
    };
    const release = lockScroll();
    document.addEventListener("keydown", onKey);
    return () => {
      release();
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);

  if (!open || !src || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={caption || alt || "Enlarged image"}
      >
        <button
          ref={closeRef}
          type="button"
          className={`${styles.close} t-button-m`}
          onClick={onClose}
        >
          Close
        </button>
        <div className={styles.stage}>
          <Image src={src} alt={alt} fill sizes="92vw" style={{ objectFit: "contain" }} />
        </div>
        {caption ? <p className={`${styles.caption} t-body-s`}>{caption}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
