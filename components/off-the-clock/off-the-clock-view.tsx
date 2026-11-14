import { NoteBoard } from "@/components/gatherings/note-board";
import wallStyles from "@/components/gatherings/gatherings.module.css";
import { Footer } from "@/components/footer/footer";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/section-header/section-header";
import { TalkAction } from "@/components/talk/talk-action";
import { noteWall } from "@/lib/content";
import type { PlacedNote } from "@/lib/notes";
import { clockItems } from "@/lib/off-the-clock";
import { PhotoPile } from "./photo-pile";
import styles from "./off-the-clock.module.css";

export function OffTheClockView({ notes }: { notes: PlacedNote[] }) {
  const wall = noteWall;

  return (
    <>
      <main id="content">
        <header className={styles.intro}>
          <div className="shell">
            <p className={`${styles.eyebrow} t-mono-label`}>Off the clock</p>
            <h1 className="t-display-h1-case">A loose pile of photos.</h1>
            <p className={`${styles.lead} t-body-l`}>
              Me, the work on my desk, and a few days with people.
            </p>
          </div>
        </header>

        <section className={styles.surface}>
          <div className="shell">
            <PhotoPile items={clockItems} />
          </div>
        </section>

        <section id={wall.id} className={wallStyles.section}>
          <div className="shell">
            <Reveal>
              <SectionHeader
                number={wall.number}
                title={wall.title}
                aside={
                  <TalkAction action={wall.button.action} arrow={wall.button.arrow}>
                    {wall.button.label}
                  </TalkAction>
                }
              />
              <NoteBoard notes={notes} board={wall.boardSize} lead={wall.lead} />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
