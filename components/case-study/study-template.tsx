import { Check } from "@/components/check/check";
import { NextProjectCard } from "@/components/case-study/next-project";
import type { ReactNode } from "react";
import Link from "next/link";
import { StudyNav } from "./linked-frames/study-nav";
import { StudyVideo } from "./linked-frames/study-video";
import styles from "./linked-frames/linked-frames.module.css";

export type StudyMeta = { label: string; value: string; check?: boolean; checkNote?: string };
export type StudyNavItem = { id: string; label: string };

export function StudySection({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-label`}>
      <div className={styles.rule} />
      <p id={`${id}-label`} className={styles.kicker}>
        {label}
      </p>
      {children}
    </section>
  );
}

export function StudyTemplate({
  title,
  summary,
  cover,
  meta,
  disclaimer,
  nav,
  children,
  credits,
  next,
  fit = false,
}: {
  title: string;
  summary: string;
  cover: {
    mp4: string;
    webm?: string;
    poster: string;
    width: number;
    height: number;
    alt: string;
    field?: string;
    mint?: boolean;
  };
  meta: StudyMeta[];
  disclaimer?: string;
  nav: StudyNavItem[];
  children: ReactNode;
  credits?: string[];
  fit?: boolean;
  next?: {
    slug: string;
    label: string;
    status: string;
    title: string;
    summary: string;
    cta: string;
  } | null;
}) {
  return (
    <>
      <article className={styles.page}>
        <div className={styles.layout}>
          <div className={styles.preface}>
            <Link className={styles.back} href="/#work">
              <span aria-hidden="true">←</span> Work
            </Link>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.dek}>{summary}</p>
            <figure className={styles.hero}>
              <StudyVideo
                mp4={cover.mp4}
                webm={cover.webm}
                poster={cover.poster}
                width={cover.width}
                height={cover.height}
                alt={cover.alt}
                eager
                cover={cover.mint}
                field={cover.field}
              />
            </figure>
            <div className={styles.measure}>
              <dl className={styles.strip}>
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt className={styles.metaLabel}>{item.label}</dt>
                    <dd className={styles.metaValue}>
                      {item.value}
                      {item.check ? <Check note={item.checkNote} /> : null}
                    </dd>
                  </div>
                ))}
              </dl>
              {disclaimer ? <p className={styles.disclaimer}>{disclaimer}</p> : null}
            </div>
          </div>
          <aside className={styles.navCol}>
            <div className={styles.navSticky}>
              <StudyNav items={nav} />
            </div>
          </aside>
          <div className={fit ? `${styles.story} ${styles.fit}` : styles.story}>
            <div className={styles.measure}>
              {children}
              {credits && credits.length > 0 ? (
                <footer className={styles.credits}>
                  {credits.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </footer>
              ) : null}
            </div>
          </div>
        </div>
      </article>
      {next ? (
        <NextProjectCard
          slug={next.slug}
          label={next.label}
          status={next.status}
          title={next.title}
          summary={next.summary}
          cta={next.cta}
        />
      ) : null}
    </>
  );
}
