import { Check } from "@/components/check/check";
import { showAnnotations, showChecks } from "@/lib/show-checks";
import type { Block, Media, TextPart, VideoBlock } from "@/lib/work-types";
import { AskHighlight } from "./ask-highlight";
import { CompareSlider } from "./compare-slider";
import { ContentList } from "./content-list";
import { FlowVideo } from "./flow-video";
import {
  Bento,
  Contained,
  FlowFrame,
  FullBleed,
  Pair,
  QuoteCard,
  ResearchCard,
  SingleCard,
  SplitBlock,
  Trio,
  VideoSlot,
} from "./media-blocks";
import { BeforeAfter, Callout, Full, Stats, Table, ThreeUp, VideoLoop } from "./layout-blocks";
import { PrototypeFlows } from "./prototype-flows";
import { ZoomFigure } from "./zoom-figure";
import styles from "./case-study.module.css";
import panelStyles from "./media-blocks.module.css";

const variantClass: Record<string, string> = {
  lead: "t-body-l",
  body: "t-body-m",
  small: "t-body-s",
  xsmall: "t-body-xs",
  mono: "t-mono-small",
};

function RichText({ text, parts }: { text: string; parts?: TextPart[] }) {
  if (!parts || parts.length === 0) return text;
  return parts.map((part, index) =>
    part.href ? (
      <a
        key={`${part.text}-${index}`}
        className={styles.textLink}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part.text}
      </a>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    ),
  );
}

function mediaOf(block: Extract<Block, { type: "figure" }>): Media | null {
  if (!block.src) return null;
  return {
    src: block.src,
    width: block.width ?? 1200,
    height: block.height ?? 800,
    objectFit: block.objectFit,
    objectPosition: block.objectPosition,
    radius: block.radius,
    figmaSize: block.figmaSize,
    standin: block.standin,
    alt: block.alt,
    caption: block.caption,
  };
}

export function Blocks({
  blocks,
  source,
  sizes,
  priorityFirst = false,
}: {
  blocks: Block[];
  source: string;
  sizes: string;
  priorityFirst?: boolean;
}) {
  const priorityIndex = priorityFirst
    ? blocks.findIndex(
        (block) => block.type === "figure" && (Boolean(block.src) || Boolean(block.images?.length)),
      )
    : -1;
  return (
    <div className={styles.stack}>
      {blocks.map((block, index) => (
        <BlockView
          key={`${block.type}-${index}`}
          block={block}
          source={source}
          sizes={sizes}
          priority={index === priorityIndex}
        />
      ))}
    </div>
  );
}

function BlockView({
  block,
  source,
  sizes,
  priority,
}: {
  block: Block;
  source: string;
  sizes: string;
  priority: boolean;
}) {
  if (block.type === "annotation") {
    if (!showAnnotations()) return null;
    return <p className={`${styles.devNote} t-mono-small`}>{block.text}</p>;
  }

  if (block.type === "paragraph") {
    if (block.askHighlight) {
      return (
        <AskHighlight
          text={block.text}
          tooltip={block.tooltip || "Ask Immanuel about this"}
          source={source}
          check={block.check}
          checkNote={block.checkNote}
        />
      );
    }
    const variant = block.variant || "body";
    const muted = variant === "small" || variant === "xsmall" || variant === "mono";
    return (
      <p
        className={`${variantClass[variant] || "t-body-m"} ${variant === "lead" ? styles.lead : ""} ${muted ? styles.muted : ""}`}
      >
        <RichText text={block.text} parts={block.parts} />
        {block.check ? <Check note={block.checkNote} /> : null}
      </p>
    );
  }

  if (block.type === "label") {
    return <p className={`${styles.blockLabel} t-mono-label`}>{block.text}</p>;
  }

  if (block.type === "heading") {
    const Tag = block.level === 4 ? "h4" : "h3";
    const variant = block.level === 4 ? "t-heading-h4" : "t-heading-h3";
    return (
      <div className={styles.headingRow} id={block.id}>
        <Tag className={variant}>{block.text}</Tag>
        {block.badge ? (
          <span className={`${styles.headingBadge} t-mono-tag`}>{block.badge}</span>
        ) : null}
        {block.check ? <Check note={block.checkNote} /> : null}
      </div>
    );
  }

  if (block.type === "list") {
    return <ContentList variant={block.variant} items={block.items} />;
  }

  if (block.type === "features") {
    return (
      <div className={styles.featureBlock}>
        {block.label ? <p className={`${styles.blockLabel} t-mono-label`}>{block.label}</p> : null}
        <ul className={styles.features}>
          {block.items.map((item) => (
            <li key={item.title}>
              <p className="t-body-m-strong">{item.title}</p>
              <p className={`${styles.muted} t-body-s`}>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === "video") {
    return <VideoView block={block} />;
  }

  if (block.type === "videos") {
    return (
      <div className={styles.stack}>
        {block.items.map((item) => (
          <VideoView key={item.label + item.caption} block={item} />
        ))}
      </div>
    );
  }

  if (block.type === "fullBleed") return <FullBleed frame={block.frame} />;
  if (block.type === "contained") return <Contained frame={block.frame} priority={priority} />;
  if (block.type === "single") return <SingleCard frame={block.frame} />;
  if (block.type === "pair") return <Pair frames={block.frames} />;
  if (block.type === "trio") return <Trio frames={block.frames} />;
  if (block.type === "bento") return <Bento frames={block.frames} />;
  if (block.type === "quote") {
    return <QuoteCard label={block.label} text={block.text} detail={block.detail} />;
  }
  if (block.type === "research") {
    return <ResearchCard text={block.text} check={block.check} checkNote={block.checkNote} />;
  }
  if (block.type === "flow") return <FlowFrame frame={block.frame} steps={block.steps} />;
  if (block.type === "compare") return <CompareSlider before={block.before} after={block.after} />;
  if (block.type === "split") {
    return (
      <SplitBlock
        title={block.title}
        text={block.text}
        frame={block.frame}
        side={block.side}
        compact={block.compact}
        check={block.check}
        checkNote={block.checkNote}
      />
    );
  }

  if (block.type === "figure") {
    if (block.images && block.images.length > 0) {
      const frames = block.images.map((image, index) => ({
        ...image,
        caption: image.caption || (index === 0 ? block.caption : undefined),
      }));
      if (frames.length >= 3) return <Trio frames={frames} />;
      return <Pair frames={frames} />;
    }
    const media = mediaOf(block);
    if (!media) return null;
    if (block.layout === "fullBleed") return <FullBleed frame={media} />;
    if (block.layout === "single") return <SingleCard frame={media} />;
    if (block.layout === "flow") return <FlowFrame frame={media} />;
    return <Contained frame={{ ...media, caption: block.caption }} priority={priority} />;
  }

  if (block.type === "figureRow") {
    if (block.figures.length >= 3) return <Trio frames={block.figures} />;
    return <Pair frames={block.figures} />;
  }

  if (block.type === "options") {
    return (
      <div className={styles.options}>
        {block.items.map((item) => (
          <article
            key={item.label}
            className={styles.option}
            data-chosen={item.chosen ? "true" : undefined}
          >
            {item.image ? <ZoomFigure media={item.image} alt={item.label} sizes="240px" /> : null}
            <div className={styles.optionMeta}>
              <span className={`${styles.optionLabel} t-mono-tag`}>{item.label}</span>
              {item.chosen ? <span className={`${styles.chosen} t-mono-tag`}>CHOSEN</span> : null}
              {item.badge ? (
                <span className={`${styles.badge} t-mono-tag`}>{item.badge}</span>
              ) : null}
            </div>
            <p className={`${styles.muted} t-body-s`}>{item.text}</p>
          </article>
        ))}
      </div>
    );
  }

  if (block.type === "decision") {
    return (
      <article id={`decision-${block.number}`} className={styles.decision}>
        <header className={styles.decisionHead}>
          <p className={`${styles.accent} t-mono-label`}>{block.eyebrow}</p>
          <h3 className="t-heading-h3">{block.title}</h3>
        </header>
        <Blocks blocks={block.blocks} source={source} sizes={sizes} />
      </article>
    );
  }

  if (block.type === "full") return <Full frame={block.frame} />;
  if (block.type === "threeUp") return <ThreeUp columns={block.columns} items={block.items} />;
  if (block.type === "videoLoop") {
    return (
      <VideoLoop
        mp4={block.mp4}
        poster={block.poster}
        width={block.width}
        height={block.height}
        title={block.title}
        text={block.text}
        caption={block.caption}
        label={block.label}
        layout={block.layout}
        flip={block.flip}
        check={block.check}
        checkNote={block.checkNote}
        webm={block.webm}
      />
    );
  }
  if (block.type === "prototypeFlows") return <PrototypeFlows items={block.items} />;
  if (block.type === "beforeAfter") return <BeforeAfter items={block.items} />;
  if (block.type === "callout") {
    return (
      <Callout
        tone={block.tone}
        kicker={block.kicker}
        title={block.title}
        text={block.text}
        frame={block.frame}
        check={block.check}
        checkNote={block.checkNote}
      />
    );
  }
  if (block.type === "stats") {
    return <Stats items={block.items} check={block.check} checkNote={block.checkNote} />;
  }
  if (block.type === "table") {
    return <Table headers={block.headers} rows={block.rows} caption={block.caption} />;
  }

  if (block.type === "panel") {
    return (
      <div className={panelStyles.panel} data-tone={block.tone}>
        {block.label ? (
          <p className={`${panelStyles.panelLabel} t-mono-tag`}>{block.label}</p>
        ) : null}
        <Blocks blocks={block.blocks} source={source} sizes={sizes} />
        {block.caption ? (
          <p className={`${panelStyles.panelCaption} t-body-s`}>{block.caption}</p>
        ) : null}
      </div>
    );
  }

  return null;
}

function VideoView({ block }: { block: VideoBlock }) {
  if (block.devOnly && !showChecks()) return null;
  if (!block.mp4) {
    return (
      <VideoSlot poster={block.poster} caption={block.caption} standin={block.standin ?? true} />
    );
  }
  return (
    <FlowVideo
      label={block.label}
      poster={block.poster}
      mp4={block.mp4}
      webm={block.webm}
      playLabel={block.playLabel}
      caption={block.caption}
    />
  );
}
