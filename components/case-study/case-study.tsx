import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { SectionHeader } from "@/components/section-header/section-header";
import { StatusTag } from "@/components/status-tag/status-tag";
import { FrameImage } from "@/components/media/frame-image";
import { TalkAction } from "@/components/talk/talk-action";
import { showChecks } from "@/lib/show-checks";
import { sectionSplitsViews } from "@/lib/built-views";
import type { Work, WorkLink, WorkSection } from "@/lib/work-types";
import Link from "next/link";
import { Blocks } from "./blocks";
import { BuiltToggle } from "./built-toggle";
import { CaseToc, CaseTocBar } from "./case-toc";
import styles from "./case-study.module.css";

const fullSizes = "(max-width: 767px) calc(100vw - 48px), 1200px";
const columnSizes = "(max-width: 767px) calc(100vw - 48px), 792px";

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
  const body = work.sections.filter((section) => !["context", "the-result"].includes(section.id));
  const context = work.sections.find((section) => section.id === "context");
  const result = work.sections.find((section) => section.id === "the-result");
  const tocNote = work.tocNote?.devOnly && showChecks() ? work.tocNote.text : undefined;
  const flows = work.links.flows ?? [];

  return (
    <article>
      <header className={styles.header}>
        <div className="shell">
          <Link className={`${styles.back} t-mono-small`} href={work.backLink.href}>
            <span aria-hidden="true">←</span> {work.backLink.label}
          </Link>
          <div className={styles.kicker}>
            <p className={`${styles.accent} t-mono-label`}>{work.eyebrow}</p>
            <StatusTag status={work.status} />
          </div>
          <h1 className="t-display-h1-case">
            {work.title}
            {work.titleCheck?.check ? <Check note={work.titleCheck.checkNote} /> : null}
          </h1>
          <p className={`${styles.summary} t-body-l`}>{work.summary}</p>
          <div className={styles.takeaway}>
            <p className={`${styles.accent} t-mono-label`}>{work.keyTakeaway.label}</p>
            <h3 className="t-heading-h3">{work.keyTakeaway.heading}</h3>
            <p className={`${styles.muted} t-body-m`}>{work.keyTakeaway.body}</p>
          </div>
          <dl className={styles.meta}>
            {work.meta.map((item) => (
              <div key={item.label} className={styles.metaItem}>
                <dt className={`${styles.muted} t-mono-label`}>{item.label}</dt>
                <dd>
                  {item.tag ? <StatusTag status={item.tag} /> : null}
                  <p
                    className={
                      item.tag
                        ? `${styles.metaValue} t-mono-small`
                        : `${styles.metaStrong} t-body-m-strong`
                    }
                  >
                    {item.value}
                    {item.check ? <Check note={item.checkNote} /> : null}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
          <div className={styles.scopeRow}>
            <div>
              <p className={`${styles.blockLabel} t-mono-label`}>{work.scope.label}</p>
              <p className="t-body-s">{work.scope.text}</p>
            </div>
            <div>
              <p className={`${styles.blockLabel} t-mono-label`}>LINKS</p>
              <LinkList items={work.links.items} />
              {flows.length > 0 ? (
                <>
                  <p className={`${styles.blockLabel} ${styles.flowLabel} t-mono-label`}>
                    {work.links.flowsLabel}
                  </p>
                  <LinkList items={flows} />
                </>
              ) : null}
            </div>
          </div>
          <CaseTocBar label={work.tocLabel} items={work.toc} />
        </div>
      </header>

      {context ? (
        <section id={context.id} className={styles.section}>
          <div className="shell">
            <SectionHeader number={context.number} title={context.title} />
            <div className={styles.split}>
              <div className={styles.rail}>
                <Blocks
                  blocks={context.blocks.filter((block) => block.type === "annotation")}
                  source={work.title}
                  sizes={columnSizes}
                />
              </div>
              <div className={styles.copy}>
                <Blocks
                  blocks={context.blocks.filter((block) => block.type !== "annotation")}
                  source={work.title}
                  sizes={columnSizes}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {result ? (
        <section id={result.id} className={`${styles.section} ${styles.surface}`}>
          <div className="shell">
            <SectionHeader number={result.number} title={result.title} />
            <SectionBody section={result} source={work.title} sizes={fullSizes} priorityFirst />
          </div>
        </section>
      ) : null}

      <div className={`shell ${styles.study}`}>
        <div className={styles.tocSlot}>
          <div className={styles.tocSticky}>
            <CaseToc label={work.tocLabel} items={work.toc} note={tocNote} />
          </div>
        </div>
        <div className={styles.studyMain}>
          {body.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <SectionHeader number={section.number} title={section.title} />
              <SectionBody section={section} source={work.title} sizes={columnSizes} />
            </section>
          ))}
        </div>
      </div>

      <section className={`${styles.nextSection} ${styles.surface}`}>
        <div className="shell">
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
        </div>
      </section>

      <section className={styles.contact}>
        <div className="shell">
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
        </div>
      </section>
    </article>
  );
}
