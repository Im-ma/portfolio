import { CampusOverview } from "@/components/case-study/campus-overview";
import { Reveal } from "@/components/motion/reveal";
import type { Block } from "@/lib/work-types";
import { SessionPlaceholder, type SessionVideoSource } from "./session-placeholder";
import styles from "./campus-testing.module.css";

// Add a session recording by setting `video` on a slot:
// { video: { mp4: "/case-studies/campus-ride/testing/session-1.mp4", webm: "/case-studies/campus-ride/testing/session-1.webm", poster: "/case-studies/campus-ride/testing/session-1-poster.png" } }
const sessions: { video?: SessionVideoSource }[] = [{}, {}, {}, {}];

export function CampusTesting({ blocks }: { blocks: Block[] }) {
  const heading = blocks.find((block) => block.type === "heading" && block.level === 3);
  const intro = blocks.find((block) => block.type === "paragraph");
  const insightHeading = blocks.find((block) => block.type === "heading" && block.level === 4);
  const insights = blocks.find((block) => block.type === "threeUp");

  return (
    <>
      <CampusOverview>
        <div className={styles.stack}>
          {heading?.type === "heading" ? <h3>{heading.text}</h3> : null}
          {intro?.type === "paragraph" ? <p className="t-body-m">{intro.text}</p> : null}
        </div>
      </CampusOverview>
      <Reveal>
        <div className={styles.sessions}>
          {sessions.map((slot, index) => (
            <SessionPlaceholder key={index} video={slot.video} />
          ))}
        </div>
      </Reveal>
      <CampusOverview>
        <div className={styles.stack}>
          {insightHeading?.type === "heading" ? (
            <h4 className="t-heading-h4">{insightHeading.text}</h4>
          ) : null}
          {insights?.type === "threeUp" ? (
            <div className={styles.columns}>
              {insights.items.map((item) => (
                <div key={item.title}>
                  <p className={`${styles.title} t-body-m-strong`}>{item.title}</p>
                  <p className={`${styles.line} t-body-s`}>{item.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CampusOverview>
    </>
  );
}
