import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { SectionHeader } from "@/components/section-header/section-header";
import { StickyNote } from "@/components/sticky-note/sticky-note";
import { TalkAction } from "@/components/talk/talk-action";
import { gatheringsPage } from "@/lib/content";
import { showChecks } from "@/lib/show-checks";
import type { PlacedNote } from "@/lib/notes";
import { PolaroidPile } from "./polaroid-pile";
import { TalkText } from "./talk-text";
import styles from "./gatherings.module.css";

export function GatheringsView({ notes }: { notes: PlacedNote[] }) {
  const page = gatheringsPage;
  const board = page.noteWall.boardSize;
  const next = page.intro.nextUp;

  return (
    <>
      <header className={styles.intro}>
        <div className={`shell ${styles.introGrid}`}>
          <div>
            <p className={`${styles.eyebrow} t-mono-label`}>{page.intro.eyebrow}</p>
            <h1 className="t-display-h1-case">{page.intro.title}</h1>
            <p className={`${styles.lead} t-body-l`}>{page.intro.lead}</p>
          </div>
          <aside className={styles.nextCard}>
            <p className={`${styles.nextLabel} t-mono-label`}>
              <span className={styles.dot} aria-hidden="true" />
              {next.label}
            </p>
            <p className="t-heading-h4">
              {next.title.text}
              {next.title.check ? <Check note={next.title.checkNote} /> : null}
            </p>
            <p className={`${styles.nextMeta} t-mono-small`}>
              {next.meta.text}
              {next.meta.check ? <Check note={next.meta.checkNote} /> : null}
            </p>
            <TalkText action={next.link.action}>{next.link.label}</TalkText>
          </aside>
        </div>
      </header>

      <section id={page.recent.id} className={`${styles.section} ${styles.surface}`}>
        <div className="shell">
          <SectionHeader number={page.recent.number} title={page.recent.title} />
          <PolaroidPile
            photos={page.recent.polaroids}
            pile={page.recent.pileSize}
            filters={page.recent.filters}
          />
          {showChecks() ? (
            <div className={styles.more}>
              <Button variant="secondary">{page.recent.moreButton.label}</Button>
            </div>
          ) : null}
        </div>
      </section>

      <section id={page.noteWall.id} className={styles.section}>
        <div className="shell">
          <SectionHeader
            number={page.noteWall.number}
            title={page.noteWall.title}
            aside={
              <TalkAction action={page.noteWall.button.action} arrow={page.noteWall.button.arrow}>
                {page.noteWall.button.label}
              </TalkAction>
            }
          />
          <p className={`${styles.wallLead} t-body-m`}>{page.noteWall.lead}</p>
          <div className={styles.board} style={{ aspectRatio: `${board.width} / ${board.height}` }}>
            {notes.map((note) => (
              <div
                key={`${note.x}-${note.y}-${note.signature}`}
                className={styles.slot}
                style={{
                  left: `${(note.x / board.width) * 100}%`,
                  top: `${(note.y / board.height) * 100}%`,
                  width: `${(note.width / board.width) * 100}%`,
                }}
              >
                <StickyNote
                  text={note.text}
                  signature={note.signature}
                  rotation={note.rotation}
                  color={note.color}
                  attachment={note.attachment}
                  check={note.check}
                  checkNote={note.checkNote}
                />
              </div>
            ))}
          </div>
          <p className={`${styles.swipe} t-mono-small`}>
            Swipe for more <span aria-hidden="true">→</span>
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="shell">
          <h2 className="t-heading-h2">{page.footer.heading}</h2>
          <div className={styles.ctaActions}>
            {page.footer.buttons.map((button) =>
              "href" in button && button.href ? (
                <Button
                  key={button.label}
                  href={button.href}
                  variant={button.variant === "secondary" ? "secondary" : "primary"}
                >
                  {button.label}
                  {"check" in button && button.check ? <Check note={button.checkNote} /> : null}
                </Button>
              ) : "action" in button && button.action ? (
                <TalkAction
                  key={button.label}
                  action={button.action}
                  variant={button.variant === "secondary" ? "secondary" : "primary"}
                >
                  {button.label}
                </TalkAction>
              ) : null,
            )}
          </div>
        </div>
      </section>
    </>
  );
}
