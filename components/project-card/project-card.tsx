import { Check } from "@/components/check/check";
import { CoverVideo } from "@/components/media/cover-video";
import { StatusTag } from "@/components/status-tag/status-tag";
import { ToolChip } from "@/components/tool-chip/tool-chip";
import type { home } from "@/lib/content";
import Link from "next/link";
import styles from "./project-card.module.css";

type Card = (typeof home.selectedWork.cards)[number];

export function ProjectCard({ card }: { card: Card }) {
  const tagCheck = "tagCheck" in card && card.tagCheck;
  return (
    <Link className={styles.card} href={card.href} data-cursor="view">
      <span className={styles.cover} style={{ background: card.cover.field }}>
        <CoverVideo
          mp4={card.cover.mp4}
          webm={card.cover.webm}
          poster={card.cover.poster}
          field={card.cover.field}
        />
      </span>
      <p className={styles.caption}>
        <span className="t-body-m-strong">
          {card.title}
          {"check" in card && card.check ? <Check note={card.checkNote} /> : null}
        </span>
        <span className={styles.captionTag}>
          {" / "}
          {card.tag}
          {tagCheck ? (
            <Check note={"tagCheckNote" in card ? card.tagCheckNote : undefined} />
          ) : null}
        </span>
      </p>
      <span className={styles.body}>
        <span className={styles.meta}>
          <span className={`${styles.num} t-mono-number`}>{card.number}</span>
          <StatusTag status={card.status} />
        </span>
        <span className={`${styles.summary} t-body-s`}>{card.summary}</span>
        <span className={styles.tools}>
          {card.tools.map((tool) => (
            <ToolChip
              key={tool.text}
              text={tool.text}
              check={"check" in tool ? tool.check : undefined}
              checkNote={"checkNote" in tool ? tool.checkNote : undefined}
            />
          ))}
        </span>
      </span>
    </Link>
  );
}
