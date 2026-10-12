"use client";

import { useState } from "react";
import { FrameImage } from "@/components/media/frame-image";
import { Lightbox } from "@/components/lightbox/lightbox";
import type { Media } from "@/lib/work-types";
import styles from "./case-study.module.css";

export function ZoomFigure({
  media,
  alt,
  caption,
  sizes,
  priority = false,
  bare = false,
}: {
  media: Media;
  alt: string;
  caption?: string;
  sizes: string;
  priority?: boolean;
  bare?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const width = media.figmaSize?.[0] || media.width;
  const height = media.figmaSize?.[1] || media.height;
  const frame = (
    <>
      <button
        type="button"
        className={styles.zoom}
        data-cursor="zoom"
        style={{ aspectRatio: `${width} / ${height}`, borderRadius: media.radius ?? 6 }}
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${alt}`}
      >
        <FrameImage
          src={media.src}
          alt={alt}
          sizes={sizes}
          objectFit={media.objectFit === "contain" ? "contain" : "cover"}
          objectPosition={media.objectPosition || "center"}
          standin={media.standin}
          priority={priority}
          fillFrame
        />
      </button>
      <Lightbox
        open={open}
        src={media.src}
        alt={alt}
        caption={caption}
        onClose={() => setOpen(false)}
      />
    </>
  );
  if (bare) return frame;
  return (
    <figure className={styles.figure}>
      {frame}
      {caption ? (
        <figcaption className={`${styles.figcaption} t-mono-small`}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
