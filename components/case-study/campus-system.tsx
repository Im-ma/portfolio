import { CampusOverview } from "@/components/case-study/campus-overview";
import { Reveal } from "@/components/motion/reveal";
import type { Block, Media } from "@/lib/work-types";
import type { ReactNode } from "react";
import styles from "./campus-system.module.css";

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

function Frame({
  src,
  alt,
  ratio,
  png,
}: {
  src: string;
  alt: string;
  ratio: string;
  png?: string;
}) {
  return (
    <div className={styles.frame} style={{ aspectRatio: ratio }}>
      {png ? (
        <picture>
          <source srcSet={src} type="image/webp" />
          <img src={png} alt={alt} />
        </picture>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
      )}
    </div>
  );
}

function isPhone(frame: Media) {
  return frame.width === 1200 && frame.height === 1647;
}

export function CampusSystem({ blocks }: { blocks: Block[] }) {
  const nodes: ReactNode[] = [];
  let text: ReactNode[] = [];
  let phone: { frame: Media; title?: string; line?: string } | null = null;
  let phones: { frame: Media; title?: string; line?: string }[] = [];

  const flushText = (key: string) => {
    if (text.length === 0) return;
    nodes.push(
      <CampusOverview key={key}>
        <div className={styles.stack}>{text}</div>
      </CampusOverview>,
    );
    text = [];
  };

  const flushPhones = (key: string) => {
    if (phones.length === 0) return;
    nodes.push(
      <div key={key} className={styles.pair}>
        {phones.map((item) => (
          <figure key={item.frame.src} className={styles.phone}>
            <Reveal>
              <Frame
                src={item.frame.src || ""}
                png={item.frame.src?.replace(/\.webp$/i, ".png")}
                alt={item.frame.alt || ""}
                ratio="1200 / 1647"
              />
            </Reveal>
            <figcaption>
              <h4 className="t-heading-h4">{item.title}</h4>
              <p className={`${styles.line} t-body-s`}>{item.line}</p>
            </figcaption>
          </figure>
        ))}
      </div>,
    );
    phones = [];
    phone = null;
  };

  blocks.forEach((block, index) => {
    if (block.type === "heading" && block.level === 4 && phone) {
      phone.title = block.text;
      return;
    }
    if (block.type === "paragraph" && phone && !phone.line) {
      phone.line = block.text;
      phones.push(phone);
      phone = null;
      return;
    }
    if (block.type === "full" && block.frame.src && isPhone(block.frame)) {
      flushText(`text-${index}`);
      phone = { frame: block.frame };
      return;
    }
    flushPhones(`phones-${index}`);
    if (block.type === "heading" && block.level !== 4) {
      flushText(`text-${index}`);
      text.push(
        <h2 key={block.id || block.text} id={block.id}>
          {block.text}
        </h2>,
      );
      return;
    }
    if (block.type === "paragraph") {
      text.push(
        <p key={block.text} className="t-body-m">
          {block.text}
        </p>,
      );
      return;
    }
    if (block.type === "threeUp") {
      text.push(<Columns key={`cols-${index}`} items={block.items} />);
      return;
    }
    if (block.type === "full" && block.frame.src) {
      flushText(`text-${index}`);
      const png = block.frame.src.includes("/system/")
        ? block.frame.src.replace(/\.webp$/i, ".png")
        : undefined;
      nodes.push(
        <Reveal key={block.frame.src}>
          <figure className={styles.figure}>
            <Frame
              src={block.frame.src}
              png={png}
              alt={block.frame.alt || ""}
              ratio={`${block.frame.width} / ${block.frame.height}`}
            />
          </figure>
        </Reveal>,
      );
    }
  });
  flushPhones("phones-end");
  flushText("text-end");

  return <>{nodes}</>;
}
