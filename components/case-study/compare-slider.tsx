"use client";

import { FrameImage } from "@/components/media/frame-image";
import type { Media } from "@/lib/work-types";
import { useState } from "react";
import styles from "./media-blocks.module.css";

export function CompareSlider({ before, after }: { before: Media; after: Media }) {
  const [value, setValue] = useState(56);
  const beforeAlt = before.caption || before.alt || "Before";
  const afterAlt = after.caption || after.alt || "After";
  return (
    <figure className={styles.compare}>
      <div className={styles.stage}>
        <div className={styles.layer}>
          <FrameImage
            src={before.src}
            alt={beforeAlt}
            sizes="(max-width: 767px) calc(100vw - 48px), 800px"
            objectPosition={before.objectPosition || "center"}
            standin={before.standin}
            fillFrame
          />
        </div>
        <div className={styles.top} style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <FrameImage
            src={after.src}
            alt={afterAlt}
            sizes="(max-width: 767px) calc(100vw - 48px), 800px"
            objectPosition={after.objectPosition || "center"}
            standin={after.standin}
            fillFrame
          />
        </div>
        <input
          className={styles.range}
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label="Compare before and after"
          aria-valuetext={`${value} percent toward the after frame`}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
      <div className={`${styles.rangeLabels} t-mono-small`}>
        <span>{before.caption || "Before"}</span>
        <span>{after.caption || "After"}</span>
      </div>
    </figure>
  );
}
