import { StudySection, StudyTemplate } from "@/components/case-study/study-template";
import { Blocks } from "@/components/case-study/blocks";
import { CampusConstraints } from "@/components/case-study/campus-constraints";
import { CampusOverview } from "@/components/case-study/campus-overview";
import { CampusPricing } from "@/components/case-study/campus-pricing";
import { CampusResearch } from "@/components/case-study/campus-research";
import { CampusSystem } from "@/components/case-study/campus-system";
import { CampusTesting } from "@/components/case-study/campus-testing";
import { Reveal } from "@/components/motion/reveal";
import { SolutionFilm } from "@/components/case-study/solution-film";
import { workAfter } from "@/lib/content";
import type { Work, WorkSection } from "@/lib/work-types";
import styles from "./linked-frames/linked-frames.module.css";

const columnSizes = "(max-width: 767px) calc(100vw - 48px), 760px";

const metaLabels: Record<string, string> = {
  TEAM: "Team",
  TIMELINE: "Timeline",
  ROLE: "Role",
  SCOPE: "Scope",
  TOOLS: "Tools",
};

function SectionBody({ section, source }: { section: WorkSection; source: string }) {
  return <Blocks blocks={section.blocks} source={source} sizes={columnSizes} />;
}

function CampusSections({ work }: { work: Work }) {
  return (
    <div className={styles.sections}>
      {work.sections.map((section) => {
        const filmIndex =
          section.id === "overview" || section.id === "solution"
            ? section.blocks.findIndex((block) => block.type === "film")
            : -1;
        const filmBlock = filmIndex >= 0 ? section.blocks[filmIndex] : null;
        const columnSection =
          filmIndex < 0
            ? section
            : {
                ...section,
                blocks: [
                  ...section.blocks.slice(0, filmIndex),
                  ...section.blocks.slice(filmIndex + 1),
                ],
              };
        let body = <SectionBody section={section} source={work.title} />;
        if (section.id === "research") body = <CampusResearch blocks={section.blocks} />;
        else if (section.id === "explorations") body = <CampusPricing blocks={section.blocks} />;
        else if (section.id === "testing") body = <CampusTesting blocks={section.blocks} />;
        else if (section.id === "system") body = <CampusSystem blocks={section.blocks} />;
        else if (section.id === "constraints") body = <CampusConstraints blocks={section.blocks} />;
        else if (section.id === "overview" || section.id === "solution") {
          body = (
            <>
              <CampusOverview>
                <SectionBody section={columnSection} source={work.title} />
              </CampusOverview>
              {filmBlock && filmBlock.type === "film" ? (
                <SolutionFilm
                  mp4={filmBlock.mp4}
                  webm={filmBlock.webm}
                  poster={filmBlock.poster}
                  label={filmBlock.label}
                />
              ) : null}
            </>
          );
        }
        return (
          <StudySection key={section.id} id={section.id} label={section.title}>
            <Reveal>{body}</Reveal>
          </StudySection>
        );
      })}
    </div>
  );
}

export function CampusRideStudy({ work }: { work: Work }) {
  const next = workAfter(work.slug);
  const nextStatus = next && "status" in next ? next.status : "";
  const cover = work.cover;
  const nav = work.toc.map((item) => ({ id: item.anchor, label: item.title }));
  return (
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
      <CampusSections work={work} />
    </StudyTemplate>
  );
}
