import { Check } from "@/components/check/check";
import { Button } from "@/components/button/button";
import { FrameImage } from "@/components/media/frame-image";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card/project-card";
import { SectionHeader } from "@/components/section-header/section-header";
import { SignalPath } from "@/components/signal-path/signal-path";
import { StickyNote } from "@/components/sticky-note/sticky-note";
import { TalkAction } from "@/components/talk/talk-action";
import { home, site } from "@/lib/content";
import type { WallNote } from "@/lib/notes";
import Link from "next/link";
import { ContactLinks } from "./contact-links";
import styles from "./home.module.css";

export function HomeView({ notes }: { notes: WallNote[] }) {
  const hero = home.hero;
  return (
    <main id="content">
      <section className={styles.hero}>
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.copy}>
            <p className={`${styles.eyebrow} t-mono-label`}>{hero.eyebrow}</p>
            <h1 className="t-display-h1">{hero.title}</h1>
            <p className={`${styles.lead} t-body-l`}>{hero.lead}</p>
            <div className={styles.actions}>
              {"href" in hero.buttons[0] && hero.buttons[0].href ? (
                <Button href={hero.buttons[0].href} variant="primary" arrow={hero.buttons[0].arrow}>
                  {hero.buttons[0].label}
                </Button>
              ) : null}
              {"action" in hero.buttons[1] && hero.buttons[1].action ? (
                <TalkAction action={hero.buttons[1].action} variant="secondary">
                  {hero.buttons[1].label}
                </TalkAction>
              ) : null}
            </div>
          </div>
          <figure className={styles.portrait}>
            <div className={styles.photo}>
              <FrameImage
                src={hero.portrait.src}
                alt={hero.portrait.alt}
                sizes="(max-width: 899px) calc(100vw - 48px), 282px"
                radius={hero.portrait.radius}
                objectPosition={hero.portrait.objectPosition}
                standin={hero.portrait.standin}
                priority
                fillFrame
              />
            </div>
            <figcaption className={`${styles.caption} t-mono-small`}>
              <span className={styles.signal} aria-hidden="true" />
              {hero.portraitCaption}
              {hero.portrait.check ? <Check note="portrait stand-in" /> : null}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section} id={home.selectedWork.id}>
        <div className="shell">
          <Reveal>
            <SectionHeader
              number={home.selectedWork.number}
              title={home.selectedWork.title}
              link={home.selectedWork.link}
            />
            <div className={styles.cards}>
              {home.selectedWork.cards.map((card) => (
                <ProjectCard key={card.slug} card={card} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className={`${styles.section} ${styles.surface}`}>
        <div className="shell">
          <Reveal>
            <SectionHeader number={home.howIWork.number} title={home.howIWork.title} />
            <SignalPath />
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <Reveal>
            <SectionHeader
              number={home.gatheringsTeaser.number}
              title={home.gatheringsTeaser.title}
              link={home.gatheringsTeaser.link}
            />
            <p className={`${styles.gatherLead} t-body-l`}>{home.gatheringsTeaser.lead}</p>
            <div className={styles.teasers}>
              {home.gatheringsTeaser.items.map((item) => (
                <Link key={item.title} className={styles.teaser} href="/gatherings">
                  <span className={styles.teaserPhoto}>
                    <FrameImage
                      src={item.image.src}
                      alt={item.image.alt}
                      sizes="(max-width: 767px) calc(100vw - 48px), 384px"
                      radius={item.image.radius}
                      objectPosition={item.image.objectPosition}
                      standin={item.image.standin}
                      fillFrame
                    />
                  </span>
                  <span className="t-body-m-strong">{item.title}</span>
                  <span className={`${styles.date} t-mono-small`}>
                    {item.date}
                    {item.check ? <Check note={item.checkNote} /> : null}
                  </span>
                </Link>
              ))}
            </div>
            <div className={styles.noteRow}>
              <div className={styles.noteIntro}>
                <p className={`${styles.noteLabel} t-mono-label`}>{home.gatheringsTeaser.noteWall.label}</p>
                <p className={`${styles.noteText} t-body-s`}>{home.gatheringsTeaser.noteWall.text}</p>
                <Link className={`${styles.wallLink} t-body-nav`} href={home.gatheringsTeaser.noteWall.link.href}>
                  {home.gatheringsTeaser.noteWall.link.label} <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div>
                <div className={styles.notes}>
                  {notes.map((note) => (
                    <StickyNote key={note.signature + note.text.slice(0, 12)} sway {...note} />
                  ))}
                </div>
                <p className={`${styles.swipe} t-mono-small`}>
                  Swipe for more <span aria-hidden="true">→</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className={`${styles.contact} ${styles.surface}`}>
        <div className="shell">
          <h2 className={`${styles.statement} t-heading-h3`}>{home.contact.heading}</h2>
          <div className={styles.contactActions}>
            {"href" in home.contact.buttons[0] && home.contact.buttons[0].href ? (
              <Button href={home.contact.buttons[0].href} variant="primary">
                {home.contact.buttons[0].label}
                {"check" in home.contact.buttons[0] && home.contact.buttons[0].check ? (
                  <Check note={home.contact.buttons[0].checkNote} onAccent />
                ) : null}
              </Button>
            ) : null}
            {"action" in home.contact.buttons[1] && home.contact.buttons[1].action ? (
              <TalkAction action={home.contact.buttons[1].action} variant="secondary">
                {home.contact.buttons[1].label}
              </TalkAction>
            ) : null}
          </div>
          <ContactLinks />
          <div className={styles.legal}>
            <p className="t-mono-small">{site.footer.copyright}</p>
            <p className="t-mono-small">{site.footer.credit}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
