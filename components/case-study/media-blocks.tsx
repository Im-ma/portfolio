import { Check } from "@/components/check/check";
import { FrameImage } from "@/components/media/frame-image";
import type { Media } from "@/lib/work-types";
import { ZoomFigure } from "./zoom-figure";
import styles from "./media-blocks.module.css";

const wide = "(max-width: 767px) calc(100vw - 48px), 1100px";
const half = "(max-width: 767px) calc(100vw - 48px), 480px";
const third = "(max-width: 767px) calc(100vw - 48px), 320px";

function altFor(frame: Media, fallback: string) {
  return frame.caption || frame.alt || fallback;
}

export function FullBleed({ frame }: { frame: Media }) {
  return (
    <div className={styles.fullBleed}>
      <ZoomFigure media={frame} alt={altFor(frame, "")} caption={frame.caption} sizes={wide} />
    </div>
  );
}

export function Contained({ frame, priority = false }: { frame: Media; priority?: boolean }) {
  return (
    <ZoomFigure
      media={frame}
      alt={altFor(frame, "")}
      caption={frame.caption}
      sizes={wide}
      priority={priority}
    />
  );
}

export function SingleCard({ frame }: { frame: Media }) {
  return (
    <figure className={styles.single}>
      <div className={styles.singleFrame}>
        <ZoomFigure bare media={frame} alt={altFor(frame, "")} sizes={half} />
      </div>
      {frame.caption ? (
        <figcaption className={`${styles.caption} t-mono-small`}>{frame.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function SplitBlock({
  text,
  frame,
  side = "end",
  check,
  checkNote,
}: {
  text: string;
  frame: Media;
  side?: "start" | "end";
  check?: boolean;
  checkNote?: string;
}) {
  return (
    <div className={styles.split} data-side={side}>
      <div className={styles.splitCopy}>
        <p className="t-body-m">
          {text}
          {check ? <Check note={checkNote} /> : null}
        </p>
      </div>
      <ZoomFigure media={frame} alt={altFor(frame, "")} caption={frame.caption} sizes={half} />
    </div>
  );
}

export function Pair({ frames }: { frames: Media[] }) {
  return (
    <div className={styles.pair}>
      {frames.map((frame) => (
        <ZoomFigure
          key={frame.src + (frame.caption || "")}
          media={frame}
          alt={altFor(frame, "")}
          caption={frame.caption}
          sizes={half}
        />
      ))}
    </div>
  );
}

export function Trio({ frames }: { frames: Media[] }) {
  return (
    <div className={styles.trio}>
      {frames.map((frame) => (
        <ZoomFigure
          key={frame.src + (frame.objectPosition || "") + (frame.caption || "")}
          media={frame}
          alt={altFor(frame, "")}
          caption={frame.caption}
          sizes={third}
        />
      ))}
    </div>
  );
}

export function Bento({ frames }: { frames: Media[] }) {
  return (
    <div className={styles.bento}>
      {frames.slice(0, 4).map((frame, index) => (
        <div key={`${frame.src}-${index}`} className={styles.bentoTile}>
          <ZoomFigure bare media={frame} alt={altFor(frame, "")} sizes={half} />
        </div>
      ))}
    </div>
  );
}

export function QuoteCard({
  label,
  text,
  detail,
}: {
  label?: string;
  text: string;
  detail?: string;
}) {
  return (
    <blockquote className={styles.quote}>
      {label ? <p className="t-mono-label">{label}</p> : null}
      <p className={`${styles.quoteBody} t-heading-h3`}>{text}</p>
      {detail ? <p className={`${styles.caption} t-body-m`}>{detail}</p> : null}
    </blockquote>
  );
}

export function ResearchCard({
  text,
  check,
  checkNote,
}: {
  text: string;
  check?: boolean;
  checkNote?: string;
}) {
  return (
    <div className={styles.research}>
      <p className="t-body-m">
        {text}
        {check ? <Check note={checkNote} /> : null}
      </p>
    </div>
  );
}

export function FlowFrame({
  frame,
  steps,
}: {
  frame?: Media;
  steps?: { title: string; text?: string }[];
}) {
  return (
    <div className={styles.flow}>
      {steps && steps.length > 0 ? (
        <ol className={styles.flowSteps}>
          {steps.map((step) => (
            <li key={step.title} className={styles.flowStep}>
              <span className="t-body-s">{step.title}</span>
              {step.text ? (
                <span className={`${styles.caption} t-body-xs`}>{step.text}</span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
      {frame ? (
        <ZoomFigure media={frame} alt={altFor(frame, "")} caption={frame.caption} sizes={wide} />
      ) : null}
    </div>
  );
}

export function VideoSlot({
  poster,
  caption,
  standin,
}: {
  poster: string;
  caption: string;
  standin?: boolean;
}) {
  return (
    <figure className={styles.slot}>
      <div className={styles.poster}>
        <FrameImage src={poster} alt="" sizes={wide} standin={standin} fillFrame />
      </div>
      <figcaption className={`${styles.caption} t-body-s`}>{caption}</figcaption>
    </figure>
  );
}
