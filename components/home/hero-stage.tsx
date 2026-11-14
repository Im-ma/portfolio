"use client";

import { Button } from "@/components/button/button";
import { TalkAction } from "@/components/talk/talk-action";
import { home } from "@/lib/content";
import Image from "next/image";
import { useId, useLayoutEffect, useRef } from "react";
import { Clasp } from "./clasp";
import { mountLanyard, pointTarget, releaseTarget } from "./lanyard-motion";
import styles from "./home.module.css";
import rig from "./lanyard.module.css";

export function HeroStage() {
  const hero = home.hero;
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const primary = hero.buttons[0];
  const secondary = hero.buttons[1];

  useLayoutEffect(() => {
    const page = pageRef.current;
    const card = cardRef.current;
    const header = document.querySelector<HTMLElement>("[data-lanyard-header]");
    const spins = [...document.querySelectorAll<HTMLElement>("[data-lanyard-spin]")];
    if (!page || !card || !header || spins.length === 0) return;
    return mountLanyard({ header, page, spins, card });
  }, []);

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    pointTarget(event.clientX, event.currentTarget.getBoundingClientRect());
  };

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.wordmarkClip} aria-hidden="true">
        <div className={styles.wordmark}>design engineer</div>
      </div>

      <div className={styles.stage}>
        <div ref={pageRef} className={`${rig.metrics} ${rig.pageRig}`}>
          <div className={rig.spin} data-lanyard-spin>
            <div className={rig.slotBack} aria-hidden="true" />
            <div className={`${rig.clasp} ${rig.claspBack}`}>
              <Clasp id={`${id}-back`} />
            </div>
            <div
              ref={cardRef}
              className={rig.cardSpin}
              onPointerMove={track}
              onPointerLeave={releaseTarget}
              onPointerUp={releaseTarget}
              onPointerCancel={releaseTarget}
            >
              <div className={rig.cardFace}>
                <div className={rig.photo}>
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
