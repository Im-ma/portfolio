import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { SectionHeader } from "@/components/section-header/section-header";
import { StatusTag } from "@/components/status-tag/status-tag";
import { CoverVideo } from "@/components/media/cover-video";
import { FrameImage } from "@/components/media/frame-image";
import { Reveal } from "@/components/motion/reveal";
import { TalkAction } from "@/components/talk/talk-action";
import { getWork } from "@/lib/content";
import { showAnnotations } from "@/lib/show-checks";
import { sectionSplitsViews } from "@/lib/built-views";
import type { Block, VideoBlock, Work, WorkLink, WorkSection } from "@/lib/work-types";
import Link from "next/link";
import { Blocks } from "./blocks";
import { BuiltToggle } from "./built-toggle";
import { CaseToc, CaseTocBar } from "./case-toc";
import { FlowVideo } from "./flow-video";
import styles from "./case-study.module.css";

const columnSizes = "(max-width: 767px) calc(100vw - 48px), 860px";

function isPlayableVideo(block: Block): block is VideoBlock {
  return block.type === "video" && !block.devOnly && Boolean(block.mp4);
}

function findVideo(work: Work) {
  for (const section of work.sections) {
    const video = section.blocks.find(isPlayableVideo);
    if (video) return video;
  }
  return null;
}

function storySections(work: Work) {
  if (work.cover?.kind !== "video" || work.cover.mp4) return work.sections;
  let skipped = false;
  return work.sections.map((section) => {
    if (skipped) return section;
    const index = section.blocks.findIndex(isPlayableVideo);
    if (index < 0) return section;
    skipped = true;
    return { ...section, blocks: section.blocks.filter((_, item) => item !== index) };
  });
}

function liveLinks(items: WorkLink[] | undefined) {
  return (items ?? []).filter((item) => Boolean(item.href) && !item.comingSoon);
}

function LinkList({ items }: { items: WorkLink[] }) {
  return (
    <ul className={styles.linkList}>
      {items.map((item) => (
        <li key={item.label}>
          <a href={item.href ?? undefined} target="_blank" rel="noopener noreferrer">
            {item.label} <span aria-hidden="true">↗</span>
            {item.check ? <Check note={item.checkNote} /> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

function NextCover({ slug }: { slug: string }) {
  const cover = getWork(slug)?.cover;
  if (!cover?.mp4 || !cover.webm || !cover.poster) return null;
  const field = cover.field || "transparent";
  return (
    <span className={styles.nextPhoto} style={{ background: field }}>
      <CoverVideo
        mp4={cover.mp4}
        webm={cover.webm}
        poster={cover.cardPoster || cover.poster}
        field={field}
      />
    </span>
  );
}

function SectionBody({
  section,
  source,
  sizes,
  priorityFirst = false,
}: {
  section: WorkSection;
  source: string;
  sizes: string;
  priorityFirst?: boolean;
}) {
  const blocks = (
    <Blocks blocks={section.blocks} source={source} sizes={sizes} priorityFirst={priorityFirst} />
  );
  if (section.id === "how-i-built-it" && sectionSplitsViews(section.blocks)) {
    return <BuiltToggle>{blocks}</BuiltToggle>;
  }
  return blocks;
}

export function CaseStudy({ work }: { work: Work }) {
  const tocNote = work.tocNote && showAnnotations() ? work.tocNote.text : undefined;
  const details = work.meta.filter((item) => !item.tag && item.label !== "STATUS");
  const coverVideo = work.cover?.kind === "video" ? findVideo(work) : null;
  const sections = storySections(work);
  const links = liveLinks(work.links.items);
  const flowLinks = liveLinks(work.links.flows);

  return (
    <article>
      <header className={styles.cover}>
        <div className="shell">
          <Link className={`${styles.back} t-mono-small`} href={work.backLink.href}>
            <span aria-hidden="true">←</span> {work.backLink.label}
          </Link>
        </div>
        {work.cover?.mp4 && work.cover.webm && work.cover.poster ? (
          <div
            className={styles.heroFilm}
            style={{ background: work.cover.field || "var(--color-neutral-soft)" }}
          >
            <CoverVideo
              mp4={work.cover.mp4}
              webm={work.cover.webm}
              poster={work.cover.poster}
              field={work.cover.field || "transparent"}
            />
          </div>
        ) : coverVideo ? (
          <div className={`shell ${styles.heroVideo}`}>
            <FlowVideo
              label={coverVideo.label}
              poster={coverVideo.poster}
              mp4={coverVideo.mp4}
              webm={coverVideo.webm}
              playLabel={coverVideo.playLabel}
              caption={coverVideo.caption}
            />
          </div>
        ) : work.cover?.src ? (
          <div
            className={styles.hero}
            data-portrait={(work.cover.height ?? 0) > (work.cover.width ?? 0) ? "true" : undefined}
          >
            <FrameImage
              src={work.cover.src}
              alt=""
              sizes="100vw"
              objectFit={(work.cover.height ?? 0) > (work.cover.width ?? 0) ? "contain" : "cover"}
              objectPosition={work.cover.objectPosition || "center"}
              standin={work.cover.standin}
              priority
              fillFrame
            />
          </div>
        ) : null}
        <div className="shell">
          <div className={styles.coverCopy}>
            <div className={styles.kicker}>
              <p className={`${styles.accent} t-mono-label`}>{work.eyebrow}</p>
              <StatusTag status={work.status} />
            </div>
            <h1 className="t-display-h1-case">
              {work.title}
              {work.titleCheck?.check ? <Check note={work.titleCheck.checkNote} /> : null}
            </h1>
            <p className={`${styles.summary} t-body-l`}>{work.summary}</p>
          </div>
          <dl className={styles.strip}>
            {details.map((item) => (
              <div key={item.label} className={styles.stripItem}>
                <dt className={`${styles.muted} t-mono-label`}>{item.label}</dt>
                <dd className="t-body-s">
                  {item.value}
                  {item.check ? <Check note={item.checkNote} /> : null}
                </dd>
              </div>
            ))}
            {links.length > 0 ? (
              <div className={`${styles.stripItem} ${styles.stripLinks}`}>
                <dt className={`${styles.blockLabel} t-mono-label`}>LINKS</dt>
                <dd>
                  <LinkList items={links} />
                </dd>
              </div>
            ) : null}
            {flowLinks.length > 0 ? (
              <div className={`${styles.stripItem} ${styles.stripLinks}`}>
                <dt className={`${styles.blockLabel} t-mono-label`}>
                  {work.links.flowsLabel || "PROTOTYPE FLOWS"}
                </dt>
                <dd>
                  <LinkList items={flowLinks} />
                </dd>
              </div>
            ) : null}
          </dl>
          <CaseTocBar label={work.tocLabel} items={work.toc} />
        </div>
      </header>

      <div className={`shell ${styles.study}`}>
        <div className={styles.tocSlot}>
          <div className={styles.tocSticky}>
            <CaseToc label={work.tocLabel} items={work.toc} note={tocNote} />
          </div>
        </div>
        <div className={styles.studyMain}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={`${styles.section}`}>
              <Reveal>
                <SectionHeader number={section.number} title={section.title} />
                <SectionBody section={section} source={work.title} sizes={columnSizes} />
              </Reveal>
            </section>
          ))}
        </div>
      </div>

      <section className={`${styles.nextSection} ${styles.surface}`}>
        <div className="shell">
          <Reveal>
            <Link
              className={styles.next}
              href={`/work/${work.nextProject.slug}`}
              data-cursor="view"
            >
              <NextCover slug={work.nextProject.slug} />
              <span className={styles.nextBody}>
                <span className={`${styles.accent} t-mono-label`}>
                  {work.nextProject.label} <span aria-hidden="true">→</span>
                </span>
                <StatusTag status={work.nextProject.status} />
                <h2 className="t-heading-h2">{work.nextProject.title}</h2>
                <span className={`${styles.muted} t-body-s`}>{work.nextProject.summary}</span>
                <span className={`${styles.nextCta} t-body-nav`}>
                  {work.nextProject.cta} <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className={styles.contact}>
        <div className="shell">
          <Reveal>
            <h2 className="t-heading-h2">{work.contact.heading}</h2>
            <p className={`${styles.contactBody} t-body-m`}>{work.contact.body}</p>
            <div className={styles.actions}>
              {work.contact.buttons.map((button) =>
                button.href ? (
                  <Button
                    key={button.label}
                    href={button.href}
                    variant={button.variant}
                    arrow={button.arrow}
                  >
                    {button.label}
                    {button.check ? <Check note={button.checkNote} /> : null}
                  </Button>
                ) : button.action ? (
                  <TalkAction
                    key={button.label}
                    action={button.action}
                    variant={button.variant}
                    arrow={button.arrow}
                  >
                    {button.label}
                  </TalkAction>
                ) : null,
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
