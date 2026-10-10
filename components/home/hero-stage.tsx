"use client";

import { Check } from "@/components/check/check";
import { Button } from "@/components/button/button";
import { FrameImage } from "@/components/media/frame-image";
import { TalkAction } from "@/components/talk/talk-action";
import { home, site } from "@/lib/content";
import { useLivelyPointer } from "@/lib/lively-pointer";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import styles from "./home.module.css";

const keywords = ["listen", "design", "build"] as const;
type Keyword = (typeof keywords)[number];

function cleanWord(word: string) {
  return word.replace(/[^a-z]/gi, "").toLowerCase();
}

function greetingNow() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  return "Good evening.";
}

function subscribeGreeting(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

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

function ListenMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 72 48" aria-hidden="true">
      <rect x="6" y="8" width="44" height="26" rx="8" />
      <path d="M18 34 L12 42" />
      <circle className={styles.bubbleDot} cx="20" cy="21" r="2" />
      <circle className={styles.bubbleDot} cx="28" cy="21" r="2" />
      <circle className={styles.bubbleDot} cx="36" cy="21" r="2" />
    </svg>
  );
}

function DesignMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 72 48" aria-hidden="true">
      <rect className={styles.frameA} x="8" y="10" width="28" height="22" rx="2" />
      <rect className={styles.frameB} x="22" y="16" width="28" height="22" rx="2" />
    </svg>
  );
}

function BuildMark() {
  return (
    <span className={`${styles.term} t-mono-small`} aria-hidden="true">
      <span>$ build</span>
      <span className={styles.caret} />
      <span className={styles.ok}>ok</span>
    </span>
  );
}

const marks: Record<Keyword, () => ReactNode> = {
  listen: ListenMark,
  design: DesignMark,
  build: BuildMark,
};

export function HeroStage() {
  const hero = home.hero;
  const reduced = useReducedMotion();
  const lively = useLivelyPointer();
  const hello = useSyncExternalStore(subscribeGreeting, greetingNow, () => "Hello.");
  const [active, setActive] = useState<Keyword>("listen");
  const [pinned, setPinned] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const lineA = useRef<SVGLineElement>(null);
  const lineB = useRef<SVGLineElement>(null);
  const lineC = useRef<SVGLineElement>(null);
  const words = hero.title.split(" ");

  useEffect(() => {
    if (reduced || pinned) return;
    const id = window.setInterval(() => {
      setActive((current) => {
        const next = keywords[(keywords.indexOf(current) + 1) % keywords.length];
        return next ?? "listen";
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced, pinned]);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg || !lively) return;
    const lines = [lineA.current, lineB.current, lineC.current];
    const anchors = [nameRef.current, demoRef.current, photoRef.current];
    let frame = 0;
    let running = true;
    let primed = false;
    const pointer = { x: 0, y: 0, inside: false };
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

  const Mark = marks[active];

  return (
    <section ref={sectionRef} className={styles.hero}>
      <svg ref={svgRef} className={styles.lines} aria-hidden="true">
        <line ref={lineA} />
        <line ref={lineB} />
        <line ref={lineC} />
      </svg>
      <div className={`shell ${styles.heroGrid}`}>
        <div className={styles.copy}>
          <p className={styles.status}>
            <span className={styles.live} aria-hidden="true" />
            <span className="t-mono-small">Online</span>
            <span className={`${styles.hello} t-mono-small`}>{hello}</span>
          </p>
          <p ref={nameRef} className={`${styles.name} t-heading-h3`}>
            {site.logo}
          </p>
          <p className={`${styles.eyebrow} t-mono-label`}>{hero.eyebrow}</p>
          <h1 className={`t-display-h1 ${styles.title}`}>
            {words.map((word, index) => {
              const key = cleanWord(word);
              const keyword = keywords.find((item) => item === key);
              return (
                <span
                  key={`${word}-${index}`}
                  className={styles.word}
                  style={{ ["--i" as string]: index }}
                >
                  {keyword ? (
                    <button
                      type="button"
                      className={`${styles.wordBtn} ${active === keyword ? styles.hot : ""}`}
                      aria-pressed={active === keyword}
                      onClick={() => {
                        setActive(keyword);
                        setPinned(true);
                      }}
                    >
                      {word}
                    </button>
                  ) : (
                    word
                  )}{" "}
                </span>
              );
            })}
          </h1>
          <div ref={demoRef} className={styles.demo} data-active={active} aria-hidden="true">
            <div className={styles.demoStage}>
              <Mark />
            </div>
            <p className={`${styles.demoLabel} t-mono-small`}>{active}</p>
          </div>
          <p className={`${styles.lead} t-body-l`}>{hero.lead}</p>
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
          <figcaption className={`${styles.caption} t-mono-small`}>
            <span className={styles.signal} aria-hidden="true" />
            {hero.portraitCaption}
            {hero.portrait.check ? <Check note="portrait stand-in" /> : null}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
