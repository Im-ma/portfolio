import { CampusOverview } from "@/components/case-study/campus-overview";
import { Reveal } from "@/components/motion/reveal";
import type { Block } from "@/lib/work-types";
import Image from "next/image";
import styles from "./campus-research.module.css";

const sourceUrls: Record<string, string | undefined> = {
  "1": "https://www.ihiretransportation.com/jobs/view/538636159",
  "2": "https://salisburync.gov/Government/Transit/Stops-and-Times",
  "3": "https://salisburync.gov/Government/Transit/Pages/default",
  "4": "https://city.ridewithvia.com/salisbury",
  "5": "https://www.vox.com/the-goods/2019/1/11/18179036/uber-lyft-rural-areas-subscription-model",
  "7": "https://en.wikipedia.org/wiki/Zimride",
  "8": "https://blog.indrive.com/article/global-rideshare-leader-indrive-launches-in-the-u-s-bringing-name-your-price-model-to-consumers-and-drivers",
};

function Cited({ text }: { text: string }) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (!match) return <span key={index}>{part}</span>;
    const href = sourceUrls[match[1]];
    if (!href) {
      return (
        <sup key={index} className={styles.cite}>
          {part}
        </sup>
      );
    }
    return (
      <sup key={index} className={styles.cite}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      </sup>
    );
  });
}

function TextBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className={styles.stack}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={index} className={block.level === 2 ? undefined : "t-heading-h3"}>
              {block.text}
            </Tag>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={index} className="t-body-m">
              <Cited text={block.text} />
            </p>
          );
        }
        if (block.type === "table") {
          return (
            <div key={index} className={styles.list}>
              <div className={styles.head} aria-hidden="true">
                <span>{block.headers[0]}</span>
                <span>{block.headers[1]}</span>
              </div>
              {block.rows.map((row) => (
                <div key={row[0]} className={styles.row}>
                  <p className={`${styles.option} t-body-s`}>{row[0]}</p>
                  <p className={`${styles.gap} t-body-s`}>
                    <Cited text={row[1] ?? ""} />
                  </p>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function CampusResearch({ blocks }: { blocks: Block[] }) {
  const imageAt = blocks.findIndex((block) => block.type === "full");
  const image = imageAt >= 0 && blocks[imageAt].type === "full" ? blocks[imageAt].frame : null;
  const before = imageAt < 0 ? blocks : blocks.slice(0, imageAt);
  const after = imageAt < 0 ? [] : blocks.slice(imageAt + 1);

  return (
    <>
      <CampusOverview>
        <TextBlocks blocks={before} />
      </CampusOverview>
      {image?.src ? (
        <Reveal>
          <figure className={styles.figure}>
            <div
              className={styles.frame}
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
            >
              <Image
                src={image.src}
                alt={image.alt || ""}
                fill
                sizes="100vw"
                style={{ objectFit: "contain" }}
              />
            </div>
          </figure>
        </Reveal>
      ) : null}
      {after.length > 0 ? (
        <CampusOverview>
          <TextBlocks blocks={after} />
        </CampusOverview>
      ) : null}
    </>
  );
}
