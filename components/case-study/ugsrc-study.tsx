import { Blocks } from "@/components/case-study/blocks";
import { CampusOverview } from "@/components/case-study/campus-overview";
import { CoverVideo } from "@/components/media/cover-video";
import { Reveal } from "@/components/motion/reveal";
import { StudySection, StudyTemplate } from "@/components/case-study/study-template";
import { TalkAction } from "@/components/talk/talk-action";
import { workAfter } from "@/lib/content";
import type { Block, Work } from "@/lib/work-types";
import filmStyles from "./solution-film.module.css";
import contactStyles from "./case-study.module.css";
import styles from "./linked-frames/linked-frames.module.css";

const columnSizes = "(max-width: 767px) calc(100vw - 48px), 760px";

const metaLabels: Record<string, string> = {
  TEAM: "Team",
  TIMELINE: "Timeline",
  ROLE: "Role",
};

function SectionBody({ blocks, source }: { blocks: Block[]; source: string }) {
  if (blocks.length === 0) return null;
  return <Blocks blocks={blocks} source={source} sizes={columnSizes} />;
}

function Promo({
  mp4,
  webm,
  poster,
  label,
}: {
  mp4: string;
  webm: string;
  poster: string;
  label: string;
}) {
  return (
    <figure className={filmStyles.figure}>
      <div className={filmStyles.film}>
        <CoverVideo
          mp4={mp4}
          webm={webm}
          poster={poster}
          field="var(--color-neutral-soft)"
          label={label}
        />
      </div>
    </figure>
  );
}

function Sections({ work }: { work: Work }) {
  return (
    <div className={styles.sections}>
      {work.sections.map((section) => {
        const wrapped = section.id === "overview" || section.id === "solution";
        const chunks: { blocks: Block[]; film?: Extract<Block, { type: "film" }> }[] = [];
        for (const block of section.blocks) {
          if (block.type === "film") {
            chunks.push({ blocks: [], film: block });
            continue;
          }
          const last = chunks[chunks.length - 1];
          if (!last || last.film) chunks.push({ blocks: [block] });
          else last.blocks.push(block);
        }
        return (
          <StudySection key={section.id} id={section.id} label={section.title}>
            <Reveal>
              {chunks.map((chunk, index) => (
                <div key={index}>
                  {chunk.blocks.length > 0 ? (
                    wrapped ? (
                      <CampusOverview>
                        <SectionBody blocks={chunk.blocks} source={work.title} />
                      </CampusOverview>
                    ) : (
                      <SectionBody blocks={chunk.blocks} source={work.title} />
                    )
                  ) : null}
                  {chunk.film ? (
                    <Promo
                      mp4={chunk.film.mp4}
                      webm={chunk.film.webm}
                      poster={chunk.film.poster}
                      label={chunk.film.label}
                    />
                  ) : null}
                </div>
              ))}
            </Reveal>
          </StudySection>
        );
      })}
    </div>
  );
}

export function UgsrcStudy({ work }: { work: Work }) {
  const next = workAfter(work.slug);
  const nextStatus = next && "status" in next ? next.status : "";
  const cover = work.cover;
  const nav = work.toc.map((item) => ({ id: item.anchor, label: item.title }));
  return (
    <>
      <StudyTemplate
        title={work.title}
        summary={work.summary}
        cover={{
          mp4: cover?.mp4 || "",
          webm: cover?.webm,
          poster: cover?.poster || "",
          width: cover?.width || 1920,
          height: cover?.height || 1080,
          alt: "Five scattered channels gather into the UGSRC App Home screen, SRC Connect opens an anonymous accommodation ticket with a reply box",
          field: cover?.field,
        }}
        meta={work.meta
          .filter((item) => !item.tag && item.label !== "STATUS")
          .map((item) => ({
            label: metaLabels[item.label] || item.label,
            value: item.value,
            check: item.check,
            checkNote: item.checkNote,
          }))}
        nav={nav}
        fit
        next={
          next
            ? {
                slug: next.slug,
                label: "NEXT PROJECT",
                status: nextStatus,
                title: next.title,
                summary: next.summary,
                cta: "Read case study",
              }
            : null
        }
      >
        <Sections work={work} />
      </StudyTemplate>
      <section className={contactStyles.contact}>
        <div className="shell">
          <Reveal>
            <h2 className="t-heading-h2">{work.contact.heading}</h2>
            <p className={`${contactStyles.contactBody} t-body-m`}>{work.contact.body}</p>
            <div className={contactStyles.actions}>
              {work.contact.buttons.map((button) =>
                button.action ? (
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
    </>
  );
}
