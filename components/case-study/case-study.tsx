import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { SectionHeader } from "@/components/section-header/section-header";
import { StatusTag } from "@/components/status-tag/status-tag";
import { FrameImage } from "@/components/media/frame-image";
import { Reveal } from "@/components/motion/reveal";
import { TalkAction } from "@/components/talk/talk-action";
import { showChecks } from "@/lib/show-checks";
import { sectionSplitsViews } from "@/lib/built-views";
import type { Block, VideoBlock, Work, WorkLink, WorkSection } from "@/lib/work-types";
import Link from "next/link";
import type { ReactNode } from "react";
import { Blocks } from "./blocks";
import { BuiltToggle } from "./built-toggle";
import { CaseToc, CaseTocBar } from "./case-toc";
import { FlowVideo } from "./flow-video";
import { QuoteCard } from "./media-blocks";
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
  if (work.cover?.kind !== "video") return work.sections;
  let skipped = false;
  return work.sections.map((section) => {
    if (skipped) return section;
    const index = section.blocks.findIndex(isPlayableVideo);
    if (index < 0) return section;
    skipped = true;
    return { ...section, blocks: section.blocks.filter((_, item) => item !== index) };
  });
}

function LinkList({ items }: { items: WorkLink[] }) {
  return (
    <ul className={styles.linkList}>
      {items.map((item) => {
        const linked = Boolean(item.href) && !item.comingSoon;
        return (
          <li key={item.label}>
            {linked ? (
              <a href={item.href ?? undefined} target="_blank" rel="noopener noreferrer">
                {item.label} <span aria-hidden="true">↗</span>
                {item.check ? <Check note={item.checkNote} /> : null}
              </a>
            ) : (
              <span className={styles.muted}>
                {item.label}
                {item.check ? <Check note={item.checkNote} /> : null}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ContextSection({ section, source }: { section: WorkSection; source: string }) {
  const notes = section.blocks.filter((block) => block.type === "annotation");
  const copy = section.blocks.filter((block) => block.type !== "annotation");
  return (
    <>
      <SectionHeader number={section.number} title={section.title} />
      <div className={styles.contextSplit}>
        <div className={styles.rail}>
          <Blocks blocks={notes} source={source} sizes={columnSizes} />
        </div>
        <div className={styles.copy}>
          <Blocks blocks={copy} source={source} sizes={columnSizes} />
        </div>
      </div>
    </>
  );
}

function SectionBody({
  section,
  source,
  sizes,
  priorityFirst = false,
  decisionExtras,
}: {
  section: WorkSection;
  source: string;
  sizes: string;
  priorityFirst?: boolean;
  decisionExtras?: Partial<Record<number, ReactNode>>;
}) {
  const blocks = (
    <Blocks
      blocks={section.blocks}
      source={source}
      sizes={sizes}
      priorityFirst={priorityFirst}
      decisionExtras={decisionExtras}
    />
  );
  if (section.id === "how-i-built-it" && sectionSplitsViews(section.blocks)) {
    return <BuiltToggle>{blocks}</BuiltToggle>;
  }
  return blocks;
}

export function CaseStudy({
  work,
  banner,
  decisionExtras,
}: {
  work: Work;
  banner?: ReactNode;
  decisionExtras?: Partial<Record<number, ReactNode>>;
}) {
  const tocNote = work.tocNote?.devOnly && showChecks() ? work.tocNote.text : undefined;
  const details = work.meta.filter((item) => !item.tag && item.label !== "STATUS");
  const coverVideo = work.cover?.kind === "video" ? findVideo(work) : null;
  const sections = storySections(work);

  return (
    <article>
      <header className={styles.cover}>
        {banner ? <div className="shell">{banner}</div> : null}
        <div className="shell">
          <Link className={`${styles.back} t-mono-small`} href={work.backLink.href}>
            <span aria-hidden="true">←</span> {work.backLink.label}
          </Link>
        </div>
        {coverVideo ? (
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
            <div className={styles.stripLinks}>
              <p className={`${styles.blockLabel} t-mono-label`}>LINKS</p>
              <LinkList items={work.links.items} />
            </div>
          </dl>
          <p className={`${styles.scopeLine} t-body-s`}>
            <span className={`${styles.scopeLabel} t-mono-label`}>{work.scope.label}</span>
            {work.scope.text}
          </p>
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
            <section
              key={section.id}
              id={section.id}
              className={`${styles.section} ${section.id === "the-result" ? styles.surfaceBand : ""}`}
            >
              <Reveal>
                {section.id === "context" ? (
                  <ContextSection section={section} source={work.title} />
                ) : (
                  <>
                    <SectionHeader number={section.number} title={section.title} />
                    <SectionBody
                      section={section}
                      source={work.title}
                      sizes={columnSizes}
                      decisionExtras={decisionExtras}
                    />
                  </>
                )}
                {section.id === "context" ? (
                  <QuoteCard
                    label={work.keyTakeaway.label}
                    text={work.keyTakeaway.heading}
                    detail={work.keyTakeaway.body}
                  />
                ) : null}
              </Reveal>
            </section>
          ))}
        </div>
      </div>

      <section className={`${styles.nextSection} ${styles.surface}`}>
        <div className="shell">
          <Reveal>
            <Link className={styles.next} href={`/work/${work.nextProject.slug}`}>
              <span className={styles.nextPhoto}>
                <FrameImage
                  src={work.nextProject.image.src}
                  alt=""
                  sizes="(max-width: 767px) calc(100vw - 48px), 588px"
                  objectPosition={work.nextProject.image.objectPosition}
                  fillFrame
                />
              </span>
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
