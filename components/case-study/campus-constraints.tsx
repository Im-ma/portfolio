import { CampusOverview } from "@/components/case-study/campus-overview";
import { Callout } from "@/components/case-study/layout-blocks";
import { Reveal } from "@/components/motion/reveal";
import type { Block } from "@/lib/work-types";
import styles from "./campus-constraints.module.css";

type Figure = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type Chunk = {
  lead: Block[];
  figure?: Figure;
  trail: Block[];
};

function isWide(figure: Figure) {
  return figure.width * 9 === figure.height * 16;
}

function chunksOf(blocks: Block[]): Chunk[] {
  const chunks: Chunk[] = [];
  let lead: Block[] = [];
  let figure: Figure | undefined;
  let trail: Block[] = [];

  const flush = () => {
    if (lead.length === 0 && !figure && trail.length === 0) return;
    chunks.push({ lead, figure, trail });
    lead = [];
    figure = undefined;
    trail = [];
  };

  for (const block of blocks) {
    if (block.type === "heading" && (lead.length > 0 || figure)) flush();
    if (block.type === "full" && block.frame.src) {
      figure = {
        src: block.frame.src,
        alt: block.frame.alt || "",
        width: block.frame.width,
        height: block.frame.height,
      };
      continue;
    }
    if (figure) trail.push(block);
    else lead.push(block);
  }
  flush();
  return chunks;
}

function Prose({ blocks }: { blocks: Block[] }) {
  const nodes = blocks.flatMap((block, index) => {
    if (block.type === "heading") {
      return [
        <h2 key={block.id || block.text || index} id={block.id}>
          {block.text}
        </h2>,
      ];
    }
    if (block.type === "paragraph") {
      return [
        <p key={`${block.text}-${index}`} className="t-body-m">
          {block.text}
        </p>,
      ];
    }
    return [];
  });
  if (nodes.length === 0) return null;
  return (
    <CampusOverview>
      <div className={styles.stack}>{nodes}</div>
    </CampusOverview>
  );
}

function Callouts({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) =>
    block.type === "callout" ? (
      <Callout
        key={block.title || block.kicker || index}
        tone={block.tone}
        kicker={block.kicker}
        title={block.title}
        text={block.text}
      />
    ) : null,
  );
}

function Questions({ items }: { items: { title?: string; text?: string }[] }) {
  return (
    <div className={styles.questions}>
      {items.map((item) => (
        <div key={item.title} className={styles.question}>
          <h4 className="t-heading-h4">{item.title}</h4>
          <p className="t-body-m">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function LabeledFigure({ figure }: { figure: Figure }) {
  const png = figure.src.replace(/\.webp$/i, ".png");
  const wide = isWide(figure);
  return (
    <Reveal>
      <figure className={styles.figure}>
        <div
          className={styles.frame}
          style={wide ? undefined : { aspectRatio: `${figure.width} / ${figure.height}` }}
        >
          <picture>
            <source srcSet={figure.src} type="image/webp" />
            <img src={png} alt={figure.alt} width={figure.width} height={figure.height} />
          </picture>
        </div>
      </figure>
    </Reveal>
  );
}

export function CampusConstraints({ blocks }: { blocks: Block[] }) {
  return (
    <div className={styles.chunks}>
      {chunksOf(blocks).map((chunk, index) => (
        <div key={chunk.figure?.src ?? index} className={styles.chunk}>
          <Prose blocks={chunk.lead} />
          <Callouts blocks={chunk.lead} />
          {chunk.figure ? <LabeledFigure figure={chunk.figure} /> : null}
          {chunk.trail.map((block, item) =>
            block.type === "threeUp" ? <Questions key={item} items={block.items} /> : null,
          )}
          <Callouts blocks={chunk.trail} />
        </div>
      ))}
    </div>
  );
}
