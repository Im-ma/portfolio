import { NextProjectCard } from "@/components/case-study/next-project";
import { linkedFrames } from "@/content/work/linked-text-frames";
import type { Block, Clip, Frame } from "@/content/work/linked-text-frames";
import { workAfter } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { EnlargeFigure } from "./enlarge-figure";
import { StudyNav } from "./study-nav";
import { StudyVideo } from "./study-video";
import styles from "./linked-frames.module.css";

const wide = "(max-width: 767px) calc(100vw - 48px), 820px";
const half = "(max-width: 767px) calc(100vw - 48px), 400px";
const third = "(max-width: 767px) calc(100vw - 48px), 260px";

function Shot({ frame, sizes, className }: { frame: Frame; sizes: string; className?: string }) {
  return (
    <Image
      src={frame.src}
      alt={frame.alt}
      width={frame.width}
      height={frame.height}
      sizes={sizes}
      className={className ?? styles.shot}
    />
  );
}

function Figure({
  frame,
  sizes,
  maxWidth,
  className,
}: {
  frame: Frame;
  sizes: string;
  maxWidth?: number;
  className?: string;
}) {
  return (
    <figure className={className ?? styles.figure} style={maxWidth ? { maxWidth } : undefined}>
      <Shot frame={frame} sizes={sizes} />
      {frame.caption ? <figcaption className={styles.caption}>{frame.caption}</figcaption> : null}
    </figure>
  );
}

function VideoFigure({ clip, eager = false }: { clip: Clip; eager?: boolean }) {
  return (
    <figure className={styles.figure}>
      <StudyVideo
        mp4={clip.mp4}
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        alt={clip.alt}
        eager={eager}
      />
      {clip.caption ? <figcaption className={styles.caption}>{clip.caption}</figcaption> : null}
    </figure>
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
    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className={styles.quote}>
          <p>&quot;{block.text}&quot;</p>
          <cite>{block.cite}</cite>
        </blockquote>
      );
    case "image":
      if (block.enlarge) {
        return (
          <EnlargeFigure
            src={block.frame.src}
            alt={block.frame.alt}
            width={block.frame.width}
            height={block.frame.height}
            caption={block.frame.caption}
            sizes={wide}
          />
        );
      }
      return (
        <Figure
          frame={block.frame}
          sizes={block.maxWidth ? `${block.maxWidth}px` : wide}
          maxWidth={block.maxWidth}
        />
      );
    case "video":
      return <VideoFigure clip={block.clip} />;
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
    case "beside":
      return (
        <div className={styles.beside}>
          <div className={styles.besideVideo}>
            <VideoFigure clip={block.clip} />
          </div>
          <div className={styles.besideStill}>
            <Figure frame={block.frame} sizes="340px" />
          </div>
        </div>
      );
    case "stills":
      return (
        <div className={styles.stills} data-count={block.frames.length}>
          {block.frames.map((frame) => (
            <Figure key={frame.src} frame={frame} sizes={third} />
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
    case "lessons":
      return (
        <div className={styles.lessons}>
          {block.items.map((item) => (
            <div key={item.title}>
              <p className={styles.lessonTitle}>{item.title}</p>
              <p className={styles.lessonBody}>{item.text}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function LinkedFramesStudy() {
  const study = linkedFrames;
  const next = workAfter(study.slug);
  const nextStatus = next && "status" in next ? next.status : "";
  return (
    <>
      <article className={styles.page}>
        <div className={styles.layout}>
          <div className={styles.preface}>
            <Link className={styles.back} href="/#work">
              <span aria-hidden="true">←</span> Work
            </Link>
            <h1 className={styles.title}>{study.title}</h1>
            <p className={styles.dek}>{study.summary}</p>
            <figure className={styles.hero}>
              <StudyVideo
                mp4={study.hero.mp4}
                poster={study.hero.poster}
                width={study.hero.width}
                height={study.hero.height}
                alt={study.hero.alt}
                eager
                cover
              />
            </figure>
            <div className={styles.measure}>
              <dl className={styles.strip}>
                {study.meta.map((item) => (
                  <div key={item.label}>
                    <dt className={styles.metaLabel}>{item.label}</dt>
                    <dd className={styles.metaValue}>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.disclaimer}>{study.disclaimer}</p>
            </div>
          </div>
          <aside className={styles.navCol}>
            <div className={styles.navSticky}>
              <StudyNav
                items={study.sections.map((section) => ({ id: section.id, label: section.label }))}
              />
            </div>
          </aside>
          <div className={styles.story}>
            <div className={styles.measure}>
              <div className={styles.sections}>
                {study.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className={styles.section}
                    aria-labelledby={`${section.id}-label`}
                  >
                    <div className={styles.rule} />
                    <p id={`${section.id}-label`} className={styles.kicker}>
                      {section.label}
                    </p>
                    {section.blocks.map((block, index) => (
                      <BlockView key={`${section.id}-${index}`} block={block} />
                    ))}
                  </section>
                ))}
              </div>
              <footer className={styles.credits}>
                {study.credits.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </footer>
            </div>
          </div>
        </div>
      </article>
      {next ? (
        <NextProjectCard
          slug={next.slug}
          label="NEXT PROJECT"
          status={nextStatus}
          title={next.title}
          summary={next.summary}
          cta="Read case study"
        />
      ) : null}
    </>
  );
}
