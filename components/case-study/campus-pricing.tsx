import { CampusOverview } from "@/components/case-study/campus-overview";
import { Reveal } from "@/components/motion/reveal";
import type { Block } from "@/lib/work-types";
import styles from "./campus-pricing.module.css";

function Columns({ items }: { items: { title?: string; text?: string }[] }) {
  return (
    <div className={styles.columns}>
      {items.map((item) => (
        <div key={item.title}>
          <p className={`${styles.title} t-body-m-strong`}>{item.title}</p>
          <p className={`${styles.line} t-body-s`}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function PricingImage({ src, alt }: { src: string; alt: string }) {
  const png = src.replace(/\.webp$/i, ".png");
  return (
    <Reveal>
      <figure className={styles.figure}>
        <div className={styles.frame}>
          <picture>
            <source srcSet={src} type="image/webp" />
            <img src={png} alt={alt} width={2400} height={1350} />
          </picture>
        </div>
      </figure>
    </Reveal>
  );
}

export function CampusPricing({ blocks }: { blocks: Block[] }) {
  const parts: { texts: Block[]; image?: { src: string; alt: string } }[] = [];
  let texts: Block[] = [];
  for (const block of blocks) {
    if (block.type === "full" && block.frame.src) {
      parts.push({
        texts,
        image: { src: block.frame.src, alt: block.frame.alt || "" },
      });
      texts = [];
    } else if (block.type !== "paragraph") {
      texts.push(block);
    }
  }
  if (texts.length > 0) parts.push({ texts });

  return (
    <>
      {parts.map((part, index) => (
        <div key={part.image?.src ?? index}>
          {part.texts.length > 0 ? (
            <CampusOverview>
              <div className={styles.stack}>
                {part.texts.map((block, item) => {
                  if (block.type === "heading") {
                    return (
                      <h2 key={item} id={block.id}>
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === "threeUp") {
                    return <Columns key={item} items={block.items} />;
                  }
                  return null;
                })}
              </div>
            </CampusOverview>
          ) : null}
          {part.image ? <PricingImage src={part.image.src} alt={part.image.alt} /> : null}
        </div>
      ))}
    </>
  );
}
