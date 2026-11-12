import { Blocks } from "@/components/case-study/blocks";
import { StudySection, StudyTemplate } from "@/components/case-study/study-template";
import { StudyVideo } from "@/components/case-study/linked-frames/study-video";
import { Reveal } from "@/components/motion/reveal";
import { TalkAction } from "@/components/talk/talk-action";
import { workAfter } from "@/lib/content";
import type { Block, VideoBlock, Work } from "@/lib/work-types";
import contactStyles from "./case-study.module.css";
import frameStyles from "./linked-frames/linked-frames.module.css";
import filmStyles from "./solution-film.module.css";

const columnSizes = "(max-width: 767px) calc(100vw - 48px), 760px";

const metaLabels: Record<string, string> = {
  TEAM: "Team",
  TIMELINE: "Timeline",
  ROLE: "Role",
  SCOPE: "Scope",
  TOOLS: "Tools",
};

function isPlayableVideo(block: Block): block is VideoBlock {
  return block.type === "video" && Boolean(block.mp4);
}

function FlowClip({ video, label }: { video: VideoBlock; label?: string }) {
  return (
    <figure className={filmStyles.figure}>
      {label ? <p className={`${contactStyles.blockLabel} t-mono-label`}>{label}</p> : null}
      <StudyVideo
        mp4={video.mp4}
        webm={video.webm}
        poster={video.poster}
        width={1920}
        height={1080}
        alt={video.caption || video.label || "Campus Events"}
      />
      {video.caption ? (
        <figcaption className={frameStyles.caption}>{video.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function SectionBlocks({ blocks, source }: { blocks: Block[]; source: string }) {
  const chunks: Array<
    { kind: "blocks"; blocks: Block[] } | { kind: "film"; video: VideoBlock; label?: string }
  > = [];

  function pushBlock(block: Block) {
    const last = chunks[chunks.length - 1];
    if (last && last.kind === "blocks") last.blocks.push(block);
    else chunks.push({ kind: "blocks", blocks: [block] });
  }

  for (const block of blocks) {
    if (block.type === "panel") {
      const videos = block.blocks.filter(isPlayableVideo);
      const rest = block.blocks.filter((item) => !isPlayableVideo(item));
      if (videos.length > 0) {
        for (const video of videos) {
          chunks.push({ kind: "film", video, label: block.label });
        }
        if (rest.length > 0 || block.caption) {
          pushBlock({ ...block, blocks: rest });
        }
        continue;
      }
    }
    if (isPlayableVideo(block)) {
      chunks.push({ kind: "film", video: block });
      continue;
    }
    pushBlock(block);
  }

  return (
    <>
      {chunks.map((chunk, index) =>
        chunk.kind === "film" ? (
          <FlowClip key={`film-${index}`} video={chunk.video} label={chunk.label} />
        ) : (
          <Blocks
            key={`blocks-${index}`}
            blocks={chunk.blocks}
            source={source}
            sizes={columnSizes}
          />
        ),
      )}
    </>
  );
}

export function CampusEventsStudy({ work }: { work: Work }) {
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
          alt: work.title,
          field: cover?.field,
        }}
        meta={work.meta
          .filter((item) => !item.tag && item.label !== "STATUS")
          .map((item) => ({
            label: metaLabels[item.label] || item.label,
            value: item.value,
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
        <div className={frameStyles.sections}>
          {work.sections.map((section) => (
            <StudySection key={section.id} id={section.id} label={section.title}>
              <Reveal>
                <SectionBlocks blocks={section.blocks} source={work.title} />
              </Reveal>
            </StudySection>
          ))}
        </div>
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
