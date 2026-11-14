"use client";

import { Button } from "@/components/button/button";
import { TalkAction } from "@/components/talk/talk-action";
import { home } from "@/lib/content";
import { useLivelyPointer } from "@/lib/lively-pointer";
import Image from "next/image";
import { useId, useRef, type PointerEvent as ReactPointerEvent } from "react";
import swing from "./lanyard.module.css";
import styles from "./home.module.css";

function LanyardClip({ id }: { id: string }) {
  const metal = `${id}-metal`;
  const shade = `${id}-shade`;
  const rivet = `${id}-rivet`;
  return (
    <svg className={styles.clip} viewBox="0 0 44 112" aria-hidden="true">
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#6f787f" />
          <stop offset="0.22" stopColor="#f5f7f8" />
          <stop offset="0.48" stopColor="#b4bdc4" />
          <stop offset="0.7" stopColor="#fbfcfd" />
          <stop offset="1" stopColor="#656e75" />
        </linearGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#d7dee3" />
          <stop offset="1" stopColor="#8b949c" />
        </linearGradient>
        <radialGradient id={rivet} cx="0.35" cy="0.32" r="0.72">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#c5ced4" />
          <stop offset="1" stopColor="#747d85" />
        </radialGradient>
      </defs>
      <path
        d="M9.2 4.2C7.4 10 8.6 17.2 13.4 22.2C16.4 25.2 19.2 26.5 22 26.5C24.8 26.5 27.6 25.2 30.6 22.2C35.4 17.2 36.6 10 34.8 4.2"
        fill="none"
        stroke={`url(#${metal})`}
        strokeWidth="3.3"
        strokeLinecap="round"
      />
      <rect x="16.4" y="27.2" width="11.2" height="5.2" rx="2.4" fill={`url(#${shade})`} />
      <rect x="19" y="31.8" width="6" height="6.4" rx="2" fill={`url(#${metal})`} />
      <rect x="15.2" y="37.4" width="13.6" height="5" rx="2.2" fill={`url(#${shade})`} />
      <rect
        x="13.2"
        y="43.2"
        width="17.6"
        height="20"
        rx="2.8"
        fill={`url(#${shade})`}
        stroke={`url(#${metal})`}
        strokeWidth="0.6"
      />
      <circle
        cx="22"
        cy="53.2"
        r="3.5"
        fill={`url(#${rivet})`}
        stroke="#9aa3ab"
        strokeWidth="0.7"
      />
      <rect x="30.4" y="50.6" width="7.2" height="3" rx="0.8" fill={`url(#${metal})`} />
      <path
        d="M17 62.2C11.6 67 9.2 77.2 11 89.2C12.8 101.2 20.4 107.2 28.6 102.6C35.4 98.8 37.2 88.2 34 78"
        fill="none"
        stroke={`url(#${metal})`}
        strokeWidth="3.35"
        strokeLinecap="round"
      />
      <path
        d="M24.6 62.8C28.2 67.2 31.6 71.6 33.6 76.4"
        fill="none"
        stroke={`url(#${metal})`}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeroStage() {
  const hero = home.hero;
  const lively = useLivelyPointer();
  const clipRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const clipId = useId().replace(/:/g, "");
  const primary = hero.buttons[0];
  const secondary = hero.buttons[1];

  const tilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!lively || !card) return;
    const box = card.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    const value = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
    if (clipRef.current) clipRef.current.style.transform = value;
    card.style.transform = value;
  };

  const rest = () => {
    if (clipRef.current) clipRef.current.style.transform = "";
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.wordmarkClip} aria-hidden="true">
        <div className={styles.wordmark}>design engineer</div>
      </div>

      <div className={styles.stage}>
        <div className={`${swing.swing} ${styles.clipHost}`}>
          <div className={styles.clipTilt} ref={clipRef} onPointerMove={tilt} onPointerLeave={rest}>
            <LanyardClip id={clipId} />
          </div>
        </div>
        <div className={`${swing.swing} ${styles.cardHost}`}>
          <div className={styles.cardTilt} ref={cardRef} onPointerMove={tilt} onPointerLeave={rest}>
            <div className={styles.card}>
              <div className={styles.punch} aria-hidden="true" />
              <div className={styles.photo}>
                <Image
                  src={hero.portrait.src}
                  alt={hero.portrait.alt}
                  fill
                  sizes="(max-width: 500px) 216px, 298px"
                  preload
                  draggable={false}
                  style={{
                    objectFit: "cover",
                    objectPosition: hero.portrait.objectPosition,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.intro}>
        <h1 id="home-hero-title" className={styles.title}>
          <span className={styles.im}>I&apos;m </span>
          <span className={styles.name}>Immanuel</span>
        </h1>
        <p className={styles.tagline}>a design engineer who builds what I design.</p>
        <div className={styles.actions}>
          {"href" in primary && primary.href ? (
            <Button href={primary.href} variant="primary" arrow={primary.arrow}>
              {primary.label}
            </Button>
          ) : null}
          {"action" in secondary && secondary.action ? (
            <TalkAction action={secondary.action} variant="secondary">
              {secondary.label}
            </TalkAction>
          ) : null}
        </div>
      </div>
    </section>
  );
}
