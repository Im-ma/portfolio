import { CoverVideo } from "@/components/media/cover-video";
import { Reveal } from "@/components/motion/reveal";
import { StatusTag } from "@/components/status-tag/status-tag";
import { getWork } from "@/lib/content";
import Link from "next/link";
import styles from "./case-study.module.css";

function NextCover({ slug }: { slug: string }) {
  const work = getWork(slug);
  const cover = work && "cover" in work ? work.cover : undefined;
  if (!cover?.mp4 || !cover.poster) return null;
  const field = cover.field || "transparent";
  return (
    <span className={styles.nextPhoto} style={{ background: field }}>
      <CoverVideo
        mp4={cover.mp4}
        webm={"webm" in cover ? cover.webm : undefined}
        poster={cover.cardPoster || cover.poster}
        field={field}
      />
    </span>
  );
}

export function NextProjectCard({
  slug,
  label,
  status,
  title,
  summary,
  cta,
}: {
  slug: string;
  label: string;
  status: string;
  title: string;
  summary: string;
  cta: string;
}) {
  return (
    <section className={`${styles.nextSection} ${styles.surface}`}>
      <div className="shell">
        <Reveal>
          <Link className={styles.next} href={`/work/${slug}`} data-cursor="view">
            <NextCover slug={slug} />
            <span className={styles.nextBody}>
              <span className={`${styles.accent} t-mono-label`}>
                {label} <span aria-hidden="true">→</span>
              </span>
              <StatusTag status={status} />
              <h2 className="t-heading-h2">{title}</h2>
              <span className={`${styles.muted} t-body-s`}>{summary}</span>
              <span className={`${styles.nextCta} t-body-nav`}>
                {cta} <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
