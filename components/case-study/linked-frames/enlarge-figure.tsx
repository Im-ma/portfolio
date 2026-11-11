"use client";

import { Lightbox } from "@/components/lightbox/lightbox";
import Image from "next/image";
import { useState } from "react";
import styles from "./linked-frames.module.css";

export function EnlargeFigure({
  src,
  alt,
  width,
  height,
  caption,
  sizes,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  sizes: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <figure className={styles.figure}>
      <button type="button" className={styles.enlarge} onClick={() => setOpen(true)}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={styles.shot}
        />
      </button>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      <button type="button" className={styles.enlargeText} onClick={() => setOpen(true)}>
        Enlarge
      </button>
      <Lightbox open={open} src={src} alt={alt} caption={caption} onClose={() => setOpen(false)} />
    </figure>
  );
}
