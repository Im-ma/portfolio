"use client";

import { Check } from "@/components/check/check";
import { Button } from "@/components/button/button";
import { FrameImage } from "@/components/media/frame-image";
import { TalkAction } from "@/components/talk/talk-action";
import { home } from "@/lib/content";
import { useLivelyPointer } from "@/lib/lively-pointer";
import { useRef, Fragment, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import styles from "./home.module.css";

function Magnetic({ children }: { children: ReactNode }) {
  const lively = useLivelyPointer();
  const ref = useRef<HTMLSpanElement>(null);
  const shift = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node || !lively) return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - (box.left + box.width / 2)) * 0.28;
    const y = (event.clientY - (box.top + box.height / 2)) * 0.4;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  return (
    <span
      ref={ref}
      className={styles.magnet}
      onPointerMove={shift}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </span>
  );
}

export function HeroStage() {
  const hero = home.hero;
  const words = hero.title.split(" ");
  const nameWords = new Set(hero.name.split(" "));

  return (
    <section className={styles.hero}>
      <div className={`shell ${styles.heroGrid}`}>
        <div className={styles.copy}>
          <div className={styles.intro}>
            <h1 className={`${styles.introLine} t-heading-h2`}>
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  {index > 0 ? " " : null}
                  <span
                    className={`${styles.word} ${nameWords.has(word) ? styles.nameMark : ""}`}
                    style={{ ["--i" as string]: index }}
                  >
                    {word}
                  </span>
                </Fragment>
              ))}
            </h1>
            <p className={`${styles.school} t-body-m`}>
              {hero.lead}
            </p>
          </div>
          <div className={styles.actions}>
            {"href" in hero.buttons[0] && hero.buttons[0].href ? (
              <Magnetic>
                <Button href={hero.buttons[0].href} variant="primary" arrow={hero.buttons[0].arrow}>
                  {hero.buttons[0].label}
                </Button>
              </Magnetic>
            ) : null}
            {"action" in hero.buttons[1] && hero.buttons[1].action ? (
              <Magnetic>
                <TalkAction action={hero.buttons[1].action} variant="secondary">
                  {hero.buttons[1].label}
                </TalkAction>
              </Magnetic>
            ) : null}
          </div>
        </div>
        <figure className={styles.portrait}>
          <div className={styles.photo}>
            <FrameImage
              src={hero.portrait.src}
              alt={hero.portrait.alt}
              sizes="(max-width: 899px) calc(100vw - 48px), 282px"
              radius={hero.portrait.radius}
              objectPosition={hero.portrait.objectPosition}
              standin={hero.portrait.standin}
              priority
              fillFrame
            />
          </div>
          {hero.portrait.check ? <Check note="portrait stand-in" /> : null}
        </figure>
      </div>
    </section>
  );
}
