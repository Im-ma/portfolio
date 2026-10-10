import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { FrameImage } from "@/components/media/frame-image";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/section-header/section-header";
import { TalkAction } from "@/components/talk/talk-action";
import { ToolChip } from "@/components/tool-chip/tool-chip";
import { aboutPage } from "@/lib/content";
import Link from "next/link";
import styles from "./about.module.css";

export function AboutView() {
  const page = aboutPage;
  return (
    <>
      <header className={styles.intro}>
        <div className={`shell ${styles.introGrid}`}>
          <div>
            <p className={`${styles.eyebrow} t-mono-label`}>{page.intro.eyebrow}</p>
            <h1 className="t-display-h1-case">{page.intro.title}</h1>
            <p className={`${styles.lead} t-body-l`}>{page.intro.lead}</p>
          </div>
          <figure className={styles.portrait}>
            <div className={styles.photo}>
              <FrameImage
                src={page.intro.photo.src}
                alt={page.intro.photo.alt}
                sizes="(max-width: 800px) calc(100vw - 48px), 384px"
                radius={page.intro.photo.radius}
                objectPosition={page.intro.photo.objectPosition}
                standin={page.intro.photo.standin}
                priority
                fillFrame
              />
            </div>
            <figcaption className={`${styles.caption} t-mono-small`}>
              {page.intro.photoCaption}
            </figcaption>
          </figure>
        </div>
      </header>

      <section className={`${styles.section} ${styles.surface}`}>
        <div className="shell">
          <Reveal>
            <SectionHeader number={page.story.number} title={page.story.title} />
            <div className={styles.story}>
              <div className={styles.storyCopy}>
                {page.story.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="t-body-l">
                    {paragraph}
                  </p>
                ))}
              </div>
              <aside className={styles.facts} aria-label={page.story.quickFactsLabel}>
                <p className={`${styles.factsLabel} t-mono-label`}>{page.story.quickFactsLabel}</p>
                <dl>
                  {page.story.quickFacts.map((fact) => (
                    <div key={fact.label} className={styles.fact}>
                      <dt className={`${styles.factLabel} t-mono-small`}>{fact.label}</dt>
                      <dd className="t-body-m-strong">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <Reveal>
            <SectionHeader number={page.principles.number} title={page.principles.title} />
            <ol className={styles.principles}>
              {page.principles.items.map((item) => (
                <li key={item.number} className={styles.principle}>
                  <span className={`${styles.principleNum} t-mono-number`}>{item.number}</span>
                  <h3 className="t-heading-h3">{item.title}</h3>
                  <p className={`${styles.muted} t-body-s`}>{item.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className={`${styles.section} ${styles.surface}`}>
        <div className="shell">
          <Reveal>
            <SectionHeader number={page.tools.number} title={page.tools.title} />
            <div className={styles.groups}>
              {page.tools.groups.map((group) => (
                <div key={group.label}>
                  <p className={`${styles.groupLabel} t-mono-label`}>{group.label}</p>
                  <ul className={styles.chips}>
                    {group.chips.map((chip) => (
                      <li key={chip.text}>
                        <ToolChip
                          text={chip.text}
                          check={"check" in chip ? chip.check : undefined}
                          checkNote={"checkNote" in chip ? chip.checkNote : undefined}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="shell">
          <Reveal>
            <SectionHeader number={page.away.number} title={page.away.title} />
            <p className={`${styles.awayLead} t-body-l`}>{page.away.lead}</p>
            <div className={styles.photos}>
              {page.away.photos.map((photo) => (
                <Link key={photo.title} className={styles.photoCard} href="/gatherings">
                  <span className={styles.photoFrame}>
                    <FrameImage
                      src={photo.image.src}
                      alt={photo.image.alt}
                      sizes="(max-width: 767px) calc(100vw - 48px), 384px"
                      radius={photo.image.radius}
                      objectPosition={photo.image.objectPosition}
                      standin={photo.image.standin}
                      fillFrame
                    />
                  </span>
                  <span className="t-body-m-strong">{photo.title}</span>
                  <span className={`${styles.muted} t-body-s`}>{photo.text}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="shell">
          <h2 className="t-heading-h2">{page.footer.heading}</h2>
          <div className={styles.actions}>
            {page.footer.buttons.map((button) =>
              "href" in button && button.href ? (
                <Button key={button.label} href={button.href} variant="secondary">
                  {button.label}
                  {"check" in button && button.check ? <Check note={button.checkNote} /> : null}
                </Button>
              ) : "action" in button && button.action ? (
                <TalkAction key={button.label} action={button.action}>
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
