"use client";

import { useRef, useState } from "react";
import { Check } from "@/components/check/check";
import { FrameImage } from "@/components/media/frame-image";
import { Lightbox } from "@/components/lightbox/lightbox";
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

type Spot = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  exiting?: boolean;
};

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function spotFrom(
  photo: PilePhoto,
  pile: { width: number; height: number },
  rotation = photo.layout.rotation,
): Spot {
  return {
    id: photo.id,
    x: (photo.layout.x / pile.width) * 100,
    y: (photo.layout.y / pile.height) * 100,
    w: (photo.layout.width / pile.width) * 100,
    h: (photo.layout.height / pile.height) * 100,
    rotation,
  };
}

function scatter(
  photos: PilePhoto[],
  slots: PilePhoto[],
  pile: { width: number; height: number },
  seed: number,
): Spot[] {
  const random = mulberry32(seed);
  return photos.map((photo, index) => {
    const slot = slots[index] ?? photo;
    const offsetX = (random() * 2 - 1) * 12;
    const offsetY = (random() * 2 - 1) * 12;
    const rotation = random() * 8 - 4;
    return {
      id: photo.id,
      x: ((slot.layout.x + offsetX) / pile.width) * 100,
      y: ((slot.layout.y + offsetY) / pile.height) * 100,
      w: (slot.layout.width / pile.width) * 100,
      h: (slot.layout.height / pile.height) * 100,
      rotation,
    };
  });
}

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
  const [placed, setPlaced] = useState<Spot[]>(() => photos.map((photo) => spotFrom(photo, pile)));
  const [open, setOpen] = useState<PilePhoto | null>(null);
  const ticket = useRef(0);
  const byId = new Map(photos.map((photo) => [photo.id, photo]));

  function select(value: string) {
    if (value === filter && value === "all") return;
    const id = ++ticket.current;
    const matching = value === "all" ? photos : photos.filter((photo) => photo.filter === value);
    const nextSeed = value === "all" ? 0 : seed + 1;
    if (value !== "all") setSeed(nextSeed);
    const next =
      value === "all"
        ? matching.map((photo) => spotFrom(photo, pile))
        : scatter(matching, photos.slice(0, matching.length), pile, nextSeed);
    const nextIds = new Set(next.map((spot) => spot.id));
    setFilter(value);
    setPlaced((current) => {
      const exiting = current
        .filter((spot) => !spot.exiting && !nextIds.has(spot.id))
        .map((spot) => ({ ...spot, exiting: true }));
      return [...exiting, ...next];
    });
    window.setTimeout(() => {
      if (ticket.current !== id) return;
      setPlaced((current) => current.filter((spot) => !spot.exiting));
    }, 180);
  }

  return (
    <div>
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
      <div
        className={styles.pile}
        style={{ aspectRatio: `${pile.width} / ${pile.height}` }}
        role="group"
        aria-label="Recent gatherings"
      >
        {placed.map((spot, index) => {
          const photo = byId.get(spot.id);
          if (!photo) return null;
          const photoWidth = photo.image.figmaSize?.[0] ?? photo.image.width;
          const photoHeight = photo.image.figmaSize?.[1] ?? photo.image.height;
          return (
            <button
              key={spot.id}
              type="button"
              className={`${styles.polaroid} ${spot.exiting ? styles.out : ""}`}
              style={{
                ["--x" as string]: `${spot.x}%`,
                ["--y" as string]: `${spot.y}%`,
                ["--w" as string]: `${spot.w}%`,
                ["--h" as string]: `${spot.h}%`,
                ["--rot" as string]: `${spot.rotation}deg`,
                ["--photo" as string]: `${photoWidth} / ${photoHeight}`,
              }}
              onClick={() => {
                if (!spot.exiting) setOpen(photo);
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
      <p className={`${styles.swipe} t-mono-small`}>
        Swipe for more <span aria-hidden="true">→</span>
      </p>
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
