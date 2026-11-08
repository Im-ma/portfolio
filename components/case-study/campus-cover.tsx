import { CoverVideo } from "@/components/media/cover-video";
import type { Work } from "@/lib/work-types";
import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { CaseTocBar } from "./case-toc";
import styles from "./campus-cover.module.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

const factOrder = ["TEAM", "TIMELINE", "ROLE"] as const;

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
        }
      : null;

  return (
    <header className={styles.cover}>
      <div className="shell">
        <p className={`${styles.crumb} t-body-s`}>
          <Link href={work.backLink.href}>Work</Link>
          <span aria-hidden="true"> / </span>
          <span>{work.title}</span>
        </p>
        <h1 className={`${styles.title} ${serif.className}`}>{work.title}</h1>
        <p className={`${styles.takeaway} t-body-l`}>{work.summary}</p>
        {film ? (
          <div className={styles.film}>
            <CoverVideo
              mp4={film.mp4}
              webm={film.webm}
              poster={film.poster}
              field="var(--color-accent)"
              eager
            />
          </div>
        ) : (
          <div className={styles.film} />
        )}
        <dl className={styles.facts}>
          {facts.map((item) => (
            <div key={item.label} className={styles.fact}>
              <dt className={`${styles.factLabel} t-body-s`}>{factLabel(item.label)}</dt>
              <dd className="t-body-s">{item.value}</dd>
            </div>
          ))}
        </dl>
        <CaseTocBar label={work.tocLabel} items={work.toc} />
      </div>
    </header>
  );
}

function factLabel(label: string) {
  if (label === "TEAM") return "Team";
  if (label === "TIMELINE") return "Timeline";
  if (label === "ROLE") return "Role";
  return label;
}
