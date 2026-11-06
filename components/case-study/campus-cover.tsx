import { Check } from "@/components/check/check";
import { CoverVideo } from "@/components/media/cover-video";
import { StatusTag } from "@/components/status-tag/status-tag";
import type { Work } from "@/lib/work-types";
import Link from "next/link";
import { CaseTocBar } from "./case-toc";
import styles from "./campus-cover.module.css";

const factOrder = ["ROLE", "TIMELINE", "TEAM", "TOOLS", "PLATFORM"] as const;

export function CampusRideCover({ work }: { work: Work }) {
  const facts = factOrder.flatMap((label) => {
    const item = work.meta.find((entry) => entry.label === label);
    return item ? [item] : [];
  });
  const cover = work.cover;
  const film =
    cover?.kind === "video" && cover.mp4 && cover.webm && cover.poster
      ? {
          mp4: cover.mp4,
          webm: cover.webm,
          poster: cover.poster,
          field: cover.field || "transparent",
        }
      : null;

  return (
    <header className={styles.cover}>
      <div className="shell">
        <Link className={`${styles.back} t-mono-small`} href={work.backLink.href}>
          <span aria-hidden="true">←</span> {work.backLink.label}
        </Link>
        <div className={styles.intro}>
          <div className={styles.kicker}>
            <p className={`${styles.accent} t-mono-label`}>{work.eyebrow}</p>
            <StatusTag status={work.status} />
          </div>
          <h1 className={styles.title}>{work.title}</h1>
          <p className={`${styles.takeaway} t-body-l`}>{work.summary}</p>
        </div>
        <dl className={styles.facts}>
          {facts.map((item) => (
            <div key={item.label} className={styles.fact}>
              <dt className={`${styles.factLabel} t-mono-label`}>{item.label}</dt>
              <dd className="t-body-s">
                {item.value}
                {item.check ? <Check note={item.checkNote} /> : null}
              </dd>
            </div>
          ))}
        </dl>
        {film ? (
          <div className={styles.film} style={{ background: film.field }}>
            <CoverVideo
              mp4={film.mp4}
              webm={film.webm}
              poster={film.poster}
              field={film.field}
              eager
            />
          </div>
        ) : null}
        <CaseTocBar label={work.tocLabel} items={work.toc} />
      </div>
    </header>
  );
}
