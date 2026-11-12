import { StudySection, StudyTemplate } from "@/components/case-study/study-template";
import { jrunStudy } from "@/content/work/jrun-llc";
import type { Block, Frame, Part } from "@/content/work/jrun-llc";
import { workAfter } from "@/lib/content";
import Image from "next/image";
import styles from "./linked-frames/linked-frames.module.css";

const wide = "(max-width: 767px) calc(100vw - 48px), 820px";
const half = "(max-width: 767px) calc(100vw - 48px), 400px";
const third = "(max-width: 767px) calc(100vw - 48px), 260px";

function Shot({ frame, sizes }: { frame: Frame; sizes: string }) {
  return (
    <Image
      src={frame.src}
      alt={frame.alt}
      width={frame.width}
      height={frame.height}
      sizes={sizes}
      className={styles.shot}
    />
  );
}

function Figure({ frame, sizes, maxWidth }: { frame: Frame; sizes: string; maxWidth?: number }) {
  return (
    <figure className={styles.figure} style={maxWidth ? { maxWidth } : undefined}>
      <Shot frame={frame} sizes={sizes} />
      {frame.caption ? <figcaption className={styles.caption}>{frame.caption}</figcaption> : null}
    </figure>
  );
}

function Parts({ parts }: { parts: Part[] }) {
  return parts.map((part, index) =>
    part.href ? (
      <a
        key={index}
        className={styles.textLink}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part.text}
      </a>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className={styles.question}>{block.text}</h2>;
    case "h4":
      return <h3 className={styles.subhead}>{block.text}</h3>;
    case "p":
      return <p className={styles.body}>{block.text}</p>;
    case "link":
      return (
        <p className={styles.body}>
          <a
            className={styles.textLink}
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {block.text}
          </a>
        </p>
      );
    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "points":
      return (
        <ul className={styles.list}>
          {block.items.map((parts) => (
            <li key={parts.map((part) => part.text).join("")}>
              <Parts parts={parts} />
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <Figure
          frame={block.frame}
          sizes={block.maxWidth ? `${block.maxWidth}px` : wide}
          maxWidth={block.maxWidth}
        />
      );
    case "tiles":
      return (
        <div className={styles.tiles}>
          {block.frames.map((frame) => (
            <figure key={frame.src} className={styles.tile}>
              <span className={styles.tileFrame}>
                <Shot frame={frame} sizes={third} />
              </span>
              {frame.caption ? (
                <figcaption className={styles.caption}>{frame.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      );
    case "pair":
      return (
        <div className={styles.pair}>
          {block.frames.map((frame) => (
            <Figure key={frame.src} frame={frame} sizes={half} />
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function JrunStudy() {
  const study = jrunStudy;
  const next = workAfter(study.slug);
  const nextStatus = next && "status" in next ? next.status : "";
  return (
    <StudyTemplate
      title={study.title}
      summary={study.summary}
      cover={{ ...study.hero, mint: false }}
      meta={study.meta}
      nav={study.sections.map((section) => ({ id: section.id, label: section.label }))}
      next={
        next
          ? {
              slug: next.slug,
              label: "NEXT PROJECT",
              status: nextStatus,
              title: next.title,
              summary: next.summary,
              cta: "Read case study",
            }
          : null
      }
    >
      <div className={styles.sections}>
        {study.sections.map((section) => (
          <StudySection key={section.id} id={section.id} label={section.label}>
            {section.blocks.map((block, index) => (
              <BlockView key={`${section.id}-${index}`} block={block} />
            ))}
          </StudySection>
        ))}
      </div>
    </StudyTemplate>
  );
}
