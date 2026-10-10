import { Check } from "@/components/check/check";
import { FrameImage } from "@/components/media/frame-image";
import { StatusTag } from "@/components/status-tag/status-tag";
import { ToolChip } from "@/components/tool-chip/tool-chip";
import type { home } from "@/lib/content";
import Link from "next/link";
import styles from "./project-card.module.css";

type Card = (typeof home.selectedWork.cards)[number];

export function ProjectCard({ card }: { card: Card }) {
  return (
    <Link className={styles.card} href={card.href} data-cursor="view">
      <span className={styles.cover}>
        <FrameImage
          src={card.cover.src}
          alt=""
          sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1199px) 46vw, 588px"
          objectPosition={card.cover.objectPosition}
          fillFrame
        />
      </span>
      <span className={styles.body}>
        <span className={styles.meta}>
          <span className={`${styles.num} t-mono-number`}>{card.number}</span>
          <StatusTag status={card.status} />
        </span>
        <span className="t-heading-h3">
          {card.title}
          {"check" in card && card.check ? <Check note={card.checkNote} /> : null}
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
