import { Check } from "@/components/check/check";
import { showChecks } from "@/lib/show-checks";
import type { Media, ThreeUpItem } from "@/lib/work-types";
import { LoopVideo } from "./loop-video";
import { ZoomFigure } from "./zoom-figure";
import styles from "./layout-blocks.module.css";

const wide = "(max-width: 767px) calc(100vw - 48px), 1000px";
const half = "(max-width: 767px) calc(100vw - 48px), 480px";
const third = "(max-width: 1099px) calc(50vw - 48px), 320px";

function altFor(frame: Media, fallback: string) {
  return frame.alt || frame.caption || fallback;
}

export function Full({ frame }: { frame: Media }) {
  return (
    <div className={styles.full}>
      <ZoomFigure media={frame} alt={altFor(frame, "")} caption={frame.caption} sizes={wide} />
    </div>
  );
}

export function ThreeUp({ columns = 3, items }: { columns?: 2 | 3 | 4; items: ThreeUpItem[] }) {
  return (
    <div className={styles.threeUp} data-columns={columns}>
      {items.map((item, index) => (
        <ThreeUpItemView key={`${item.title ?? "item"}-${index}`} item={item} />
      ))}
    </div>
  );
}

function ThreeUpItemView({ item }: { item: ThreeUpItem }) {
  if (item.placeholder) {
    return (
      <div className={styles.slot}>
        <div className={styles.placeholder}>
          {showChecks() ? <span className={styles.flag}>STAND-IN</span> : null}
          <p className={`${styles.placeholderLabel} t-mono-label`}>Coming soon</p>
        </div>
        {item.title ? (
          <p className="t-body-m-strong">
            {item.title}
            {item.check ? <Check note={item.checkNote} /> : null}
          </p>
        ) : null}
        {item.text ? <p className={`${styles.muted} t-body-s`}>{item.text}</p> : null}
      </div>
    );
  }

  return (
    <div className={item.frame ? styles.slot : styles.pillar}>
      {item.frame ? (
        <ZoomFigure media={item.frame} alt={altFor(item.frame, item.title || "")} sizes={third} />
      ) : null}
      {item.title ? (
        <p className="t-body-m-strong">
          {item.title}
          {item.check ? <Check note={item.checkNote} /> : null}
        </p>
      ) : null}
      {item.text ? <p className={`${styles.muted} t-body-s`}>{item.text}</p> : null}
    </div>
  );
}

export function VideoLoop({
  mp4,
  poster,
  width,
  height,
  title,
  text,
  caption,
  label,
  layout = "split",
  flip = false,
  check,
  checkNote,
}: {
  mp4: string;
  poster: string;
  width: number;
  height: number;
  title?: string;
  text?: string;
  caption?: string;
  label?: string;
  layout?: "split" | "full";
  flip?: boolean;
  check?: boolean;
  checkNote?: string;
}) {
  const name = label || title || "Flow";
  const media = (
    <div className={styles.loopMedia}>
      <LoopVideo poster={poster} mp4={mp4} label={name} width={width} height={height} />
    </div>
  );

  if (layout === "full") {
    return (
      <figure className={styles.loopFull}>
        {media}
        {caption ? (
          <figcaption className={`${styles.caption} t-mono-small`}>{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <div className={styles.loop} data-flip={flip ? "true" : undefined}>
      {media}
      <div className={styles.loopCopy}>
        {title ? <h3 className="t-heading-h4">{title}</h3> : null}
        {text ? <p className="t-body-m">{text}</p> : null}
        {caption ? <p className={`${styles.caption} t-mono-small`}>{caption}</p> : null}
        {check ? <Check note={checkNote} /> : null}
      </div>
    </div>
  );
}

export function BeforeAfter({
  items,
}: {
  items: { label: string; text?: string; frame: Media }[];
}) {
  return (
    <div className={styles.beforeAfter}>
      {items.map((item) => (
        <figure key={item.label} className={styles.ba}>
          <ZoomFigure media={item.frame} alt={altFor(item.frame, item.label)} sizes={half} />
          <figcaption>
            <p
              className={`${styles.baLabel} t-mono-label`}
              data-after={item.label.toLowerCase().startsWith("after") ? "true" : undefined}
            >
              {item.label}
            </p>
            {item.text ? <p className={`${styles.muted} t-body-s`}>{item.text}</p> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Callout({
  tone = "neutral",
  kicker,
  title,
  text,
  frame,
  check,
  checkNote,
}: {
  tone?: "accent" | "neutral" | "signal";
  kicker?: string;
  title?: string;
  text?: string;
  frame?: Media;
  check?: boolean;
  checkNote?: string;
}) {
  return (
    <aside className={styles.callout} data-tone={tone}>
      {kicker ? <p className={`${styles.calloutKicker} t-mono-label`}>{kicker}</p> : null}
      {title ? <h3 className={`${styles.calloutTitle} t-heading-h3`}>{title}</h3> : null}
      {text ? (
        <p className={`${styles.calloutText} t-body-m`}>
          {text}
          {check ? <Check note={checkNote} /> : null}
        </p>
      ) : check ? (
        <Check note={checkNote} />
      ) : null}
      {frame ? (
        <ZoomFigure
          media={frame}
          alt={altFor(frame, title || kicker || "")}
          caption={frame.caption}
          sizes={wide}
        />
      ) : null}
    </aside>
  );
}

export function Stats({
  items,
  check,
  checkNote,
}: {
  items: { value: string; text: string }[];
  check?: boolean;
  checkNote?: string;
}) {
  return (
    <div className={styles.statsBlock}>
      <div className={styles.stats}>
        {items.map((item) => (
          <div key={item.value}>
            <p className={`${styles.statValue} t-heading-metric`}>{item.value}</p>
            <p className={`${styles.statText} t-body-s`}>{item.text}</p>
          </div>
        ))}
      </div>
      {check ? <Check note={checkNote} /> : null}
    </div>
  );
}

export function Table({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        {caption ? <caption className={`${styles.caption} t-mono-small`}>{caption}</caption> : null}
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="t-body-s" scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${headers[index] ?? index}`}
                  className="t-body-s"
                  data-label={headers[index] ?? ""}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
