"use client";

import { Check } from "@/components/check/check";
import { Button } from "@/components/button/button";
import { FrameImage } from "@/components/media/frame-image";
import { TalkAction } from "@/components/talk/talk-action";
import { home } from "@/lib/content";
import { lastFinePoint, useLivelyPointer } from "@/lib/lively-pointer";
import {
  useEffect,
  useRef,
  Fragment,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
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
  const lively = useLivelyPointer();
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const lineA = useRef<SVGLineElement>(null);
  const lineB = useRef<SVGLineElement>(null);
  const lineC = useRef<SVGLineElement>(null);
  const words = hero.title.split(" ");

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg || !lively) return;
    const lines = [lineA.current, lineB.current, lineC.current];
    const anchors = [nameRef.current, roleRef.current, photoRef.current];
    let frame = 0;
    let running = true;
    let primed = false;
    const start = lastFinePoint();
    const opening = section.getBoundingClientRect();
    const pointer = {
      x: start.x,
      y: start.y,
      inside:
        start.x >= opening.left &&
        start.x <= opening.right &&
        start.y >= opening.top &&
        start.y <= opening.bottom,
    };
    const ends = anchors.map(() => ({ x: 0, y: 0 }));

    const place = () => {
      if (!running) return;
      const box = section.getBoundingClientRect();
      const width = Math.max(1, Math.round(box.width));
      const height = Math.max(1, Math.round(box.height));
      if (svg.dataset.w !== String(width) || svg.dataset.h !== String(height)) {
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.dataset.w = String(width);
        svg.dataset.h = String(height);
      }
      anchors.forEach((anchor, index) => {
        const line = lines[index];
        if (!line || !anchor) return;
        const from = anchor.getBoundingClientRect();
        const x1 = from.left + from.width / 2 - box.left;
        const y1 = from.top + from.height / 2 - box.top;
        const photo = photoRef.current?.getBoundingClientRect();
        const restX = photo ? photo.left + 28 - box.left : x1;
        const restY = photo ? photo.top + photo.height * 0.42 - box.top : y1;
        const goalX = pointer.inside ? pointer.x - box.left : restX;
        const goalY = pointer.inside ? pointer.y - box.top : restY;
        const end = ends[index] ?? { x: goalX, y: goalY };
        if (!primed) {
          end.x = goalX;
          end.y = goalY;
        } else {
          end.x += (goalX - end.x) * 0.18;
          end.y += (goalY - end.y) * 0.18;
        }
        ends[index] = end;
        line.setAttribute("x1", String(x1));
        line.setAttribute("y1", String(y1));
        line.setAttribute("x2", String(end.x));
        line.setAttribute("y2", String(end.y));
      });
      primed = true;
      svg.style.opacity = "1";
      frame = window.requestAnimationFrame(place);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      const box = section.getBoundingClientRect();
      pointer.inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
    };

    svg.style.opacity = "0";
    frame = window.requestAnimationFrame(place);
    window.addEventListener("pointermove", onMove);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [lively]);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <svg ref={svgRef} className={styles.lines} aria-hidden="true">
        <line ref={lineA} />
        <line ref={lineB} />
        <line ref={lineC} />
      </svg>
      <div className={`shell ${styles.heroGrid}`}>
        <div className={styles.copy}>
          <div className={styles.intro}>
            <h1 ref={nameRef} className="t-display-h1">
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  {index > 0 ? " " : null}
                  <span className={styles.word} style={{ ["--i" as string]: index }}>
                    {word}
                  </span>
                </Fragment>
              ))}
            </h1>
            <p ref={roleRef} className={`${styles.lead} t-body-l`}>
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
          <div ref={photoRef} className={styles.photo}>
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
