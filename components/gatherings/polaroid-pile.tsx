"use client";

import { useFreeArrange, type Piece } from "@/components/arrange/use-free-arrange";
import { Check } from "@/components/check/check";
import { Lightbox } from "@/components/lightbox/lightbox";
import { FrameImage } from "@/components/media/frame-image";
import { useMemo, useRef, useState } from "react";
import styles from "./gatherings.module.css";

export type PilePhoto = {
  id: number;
  title: string;
  caption: string;
  date: string;
  category: string;
  filter: string;
  check?: boolean;
  checkNote?: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectPosition?: string;
    standin?: boolean;
    figmaSize?: readonly number[];
  };
  layout: { x: number; y: number; width: number; height: number; rotation: number };
};

export function PolaroidPile({
  photos,
  pile,
  filters,
}: {
  photos: PilePhoto[];
  pile: { width: number; height: number };
  filters: { label: string; value: string }[];
}) {
  const [filter, setFilter] = useState("all");
  const [seed, setSeed] = useState(1);
  const [open, setOpen] = useState<PilePhoto | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const minSize = useMemo(() => ({ width: 172, height: 220 }), []);
  const byId = useMemo(() => new Map(photos.map((photo) => [String(photo.id), photo])), [photos]);

  const defaults = useMemo<Piece[]>(
    () =>
      photos.map((photo) => ({
        id: String(photo.id),
        x: (photo.layout.x / pile.width) * 100,
        y: (photo.layout.y / pile.height) * 100,
        w: (photo.layout.width / pile.width) * 100,
        h: (photo.layout.height / pile.height) * 100,
        rotation: photo.layout.rotation,
      })),
    [photos, pile.width, pile.height],
  );

  const visibleIds = useMemo(
    () =>
      (filter === "all" ? photos : photos.filter((photo) => photo.filter === filter)).map((photo) =>
        String(photo.id),
      ),
    [photos, filter],
  );

  const arrange = useFreeArrange({
    canvasRef,
    storageKey: "im-arrange:gatherings-polaroids",
    design: pile,
    defaults,
    visibleIds,
    layout: filter === "all" ? "saved" : "scatter",
    scatterSeed: seed,
    minSize,
  });

  function select(value: string) {
    if (value === filter && value === "all") return;
    arrange.animate(() => {
      if (value !== "all") setSeed((current) => current + 1);
      setFilter(value);
    });
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="radiogroup" aria-label="Filter gatherings">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={filter === item.value}
              className={`${styles.chip} t-body-nav`}
              data-active={filter === item.value ? "true" : undefined}
              onClick={() => select(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`${arrange.tidyClass} t-mono-small`}
          onClick={() => arrange.tidy(() => setFilter("all"))}
        >
          Tidy up
        </button>
      </div>
      <div
        ref={canvasRef}
        className={`${styles.pile} ${arrange.canvasClass}`}
        style={arrange.canvasStyle}
        role="group"
        aria-label="Recent gatherings"
      >
        {visibleIds.map((id) => {
          const photo = byId.get(id);
          const bound = arrange.bind(id);
          if (!photo) return null;
          const photoWidth = photo.image.figmaSize?.[0] ?? photo.image.width;
          const photoHeight = photo.image.figmaSize?.[1] ?? photo.image.height;
          return (
            <button
              key={id}
              type="button"
              {...bound}
              className={`${styles.polaroid} ${bound.className ?? ""}`}
              style={{
                ...bound.style,
                ["--photo" as string]: `${photoWidth} / ${photoHeight}`,
              }}
              onClick={() => {
                if (arrange.taken()) return;
                setOpen(photo);
              }}
            >
              <span className={styles.photo}>
                <FrameImage
                  src={photo.image.src}
                  alt={photo.image.alt}
                  sizes="300px"
                  objectPosition={photo.image.objectPosition || "center"}
                  standin={photo.image.standin}
                  fillFrame
                />
              </span>
              <span className={`${styles.polaroidTitle} t-hand-caption`}>
                {photo.title}
                {photo.check ? <Check note={photo.checkNote} /> : null}
              </span>
              <span className={`${styles.polaroidCaption} t-body-xs`}>{photo.caption}</span>
              <span className={`${styles.polaroidMeta} t-mono-small`}>
                <span>{photo.date}</span>
                <span>{photo.category}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className={`${arrange.holdClass} t-mono-small`}>Hold, then drag</p>
      <p className="sr-only">Arrow keys nudge a focused photo. Shift moves it farther.</p>
      <Lightbox
        open={Boolean(open)}
        src={open?.image.src}
        alt={open?.image.alt || ""}
        caption={open ? `${open.title}. ${open.caption} ${open.date}` : undefined}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}
