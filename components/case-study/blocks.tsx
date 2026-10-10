import { Check } from "@/components/check/check";
import { showChecks } from "@/lib/show-checks";
import type { Block, Media } from "@/lib/work-types";
import { AskHighlight } from "./ask-highlight";
import { ContentList } from "./content-list";
import { FlowVideo } from "./flow-video";
import { ZoomFigure } from "./zoom-figure";
import styles from "./case-study.module.css";

const variantClass: Record<string, string> = {
  lead: "t-body-l",
  body: "t-body-m",
  small: "t-body-s",
  xsmall: "t-body-xs",
  mono: "t-mono-small",
};

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
    if (!showChecks() || block.devOnly === false) return null;
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
        {block.text}
        {block.check ? <Check note={block.checkNote} /> : null}
      </p>
    );
  }

  if (block.type === "label") {
    return <p className={`${styles.blockLabel} t-mono-label`}>{block.text}</p>;
  }

  if (block.type === "heading") {
    return <h3 className="t-heading-h3">{block.text}</h3>;
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
    return <FlowVideo {...block} />;
  }

  if (block.type === "figure") {
    if (block.images && block.images.length > 0) {
      return (
        <figure className={styles.figure}>
          <div className={styles.band}>
            {block.images.map((image, imageIndex) => (
              <div
                key={image.src}
                className={styles.bandItem}
                style={{ flexGrow: image.figmaSize?.[0] || 1 }}
              >
                <ZoomFigure
                  bare
                  media={image}
                  alt={image.caption || block.caption || image.alt || source}
                  caption={image.caption || block.caption}
                  sizes="(max-width: 767px) calc(100vw - 48px), 560px"
                  priority={priority && imageIndex === 0}
                />
              </div>
            ))}
          </div>
          {block.caption ? (
            <figcaption className={`${styles.figcaption} t-mono-small`}>{block.caption}</figcaption>
          ) : null}
        </figure>
      );
    }
    const media = mediaOf(block);
    if (!media) return null;
    return (
      <ZoomFigure
        media={media}
        alt={block.caption || block.alt || source}
        caption={block.caption}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (block.type === "figureRow") {
    return (
      <div className={styles.figureRow} style={{ ["--cols" as string]: block.figures.length }}>
        {block.figures.map((figure) => (
          <ZoomFigure
            key={figure.src}
            media={figure}
            alt={figure.caption || source}
            caption={figure.caption}
            sizes="(max-width: 767px) calc(100vw - 48px), 380px"
          />
        ))}
      </div>
    );
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

  return null;
}
