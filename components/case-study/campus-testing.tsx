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
    </>
  );
}
