"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/lightbox/lightbox";
import type { Media } from "@/lib/work-types";
import { PhoneFrame } from "./phone-frame";
import styles from "./phone-shot.module.css";
import cropStyles from "./screen-crop.module.css";

const wellRatio = 393 / 852;

export function ScreenCrop({
  src,
  alt,
  imgWidth,
  imgHeight,
  screen,
  sizes = "280px",
}: {
  src: string;
  alt: string;
  imgWidth: number;
  imgHeight: number;
  screen: { x: number; y: number; w: number; h: number };
  sizes?: string;
}) {
  const wide = screen.w / screen.h > wellRatio;
  return (
    <div
      className={cropStyles.crop}
      data-wide={wide ? "true" : "false"}
      style={{ aspectRatio: `${screen.w} / ${screen.h}` }}
    >
      <Image
        src={src}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        sizes={sizes}
        style={{
          display: "block",
          width: `${(imgWidth / screen.w) * 100}%`,
          height: "auto",
          maxWidth: "none",
          marginLeft: `${(-screen.x / screen.w) * 100}%`,
          marginTop: `${(-screen.y / screen.w) * 100}%`,
        }}
      />
    </div>
  );
}

export function PhoneShot({ media, alt }: { media: Media; alt: string }) {
  const [open, setOpen] = useState(false);
  if (!media.screen) return null;
  return (
    <>
      <button
        type="button"
        className={styles.shot}
        data-cursor="zoom"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${alt}`}
      >
        <PhoneFrame label={alt}>
          <ScreenCrop
            src={media.src}
            alt={alt}
            imgWidth={media.width}
            imgHeight={media.height}
            screen={media.screen}
          />
        </PhoneFrame>
      </button>
      <Lightbox
        open={open}
        src={media.src}
        alt={alt}
        caption={media.caption}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
