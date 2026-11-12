import { StudySection, StudyTemplate } from "@/components/case-study/study-template";
import { StudyVideo } from "@/components/case-study/linked-frames/study-video";
import { jrunStudy } from "@/content/work/jrun-llc";
import type { Clip, Frame, Part } from "@/content/work/jrun-llc";
import { workAfter } from "@/lib/content";
import { DeviceClip } from "./jrun-screen";
import { Inter, Playfair_Display } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./linked-frames/linked-frames.module.css";
import local from "./jrun-study.module.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const third = "(max-width: 767px) calc(100vw - 48px), 260px";

const colors = [
  { name: "Cream", token: "--cream", hex: "#fdf3e7" },
  { name: "Ink", token: "--ink", hex: "#17130f" },
  { name: "Rose", token: "--hair-rose", hex: "#cf6a3a" },
  { name: "Olive", token: "--food-olive", hex: "#74804a" },
];

function Shot({
  frame,
  sizes,
  unoptimized = false,
}: {
  frame: Frame;
  sizes: string;
  unoptimized?: boolean;
}) {
  return (
    <Image
      src={frame.src}
      alt={frame.alt}
      width={frame.width}
      height={frame.height}
      sizes={sizes}
      className={styles.shot}
      unoptimized={unoptimized}
    />
  );
}

function ClipFigure({ clip }: { clip: Clip }) {
  return (
    <figure className={styles.figure}>
      <StudyVideo
        mp4={clip.mp4}
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        alt={clip.alt}
        field="#17130f"
      />
      {clip.caption ? <figcaption className={styles.caption}>{clip.caption}</figcaption> : null}
    </figure>
  );
}

function Parts({ parts }: { parts: Part[] }) {
  return parts.map((part, index) =>
    part.href ? (
      <a
        key={index}
        className={styles.textLink}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part.text}
      </a>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}

function Headline({
  id,
  eyebrow,
  headline,
  children,
}: {
  id: string;
  eyebrow: string;
  headline: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.rule} />
      <p className={local.eyebrow}>{eyebrow}</p>
      <h2 id={`${id}-title`} className={styles.question}>
        {headline}
      </h2>
      {children}
    </section>
  );
}

export function JrunStudy() {
  const study = jrunStudy;
  const next = workAfter(study.slug);
  const nextStatus = next && "status" in next ? next.status : "";
  const nav = [
    { id: "about", label: "About" },
    { id: "approach", label: "Approach" },
    ...study.scenes.map((scene) => ({ id: scene.id, label: scene.nav })),
    { id: "requests", label: "Requests" },
    { id: "system", label: "Design system" },
    { id: "outcome", label: "Outcome" },
  ];

  return (
    <StudyTemplate
      title={study.title}
      summary={study.summary}
      cover={{ ...study.hero, mint: false }}
      meta={study.meta}
      nav={nav}
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
      <div className={styles.sections}>
        <figure className={local.heroDevice}>
          <div className={local.laptop}>
            <div className={local.laptopScreen}>
              <DeviceClip
                mp4={study.laptop.mp4}
                poster={study.laptop.poster}
                alt={study.laptop.alt}
              />
            </div>
          </div>
          <figcaption className={styles.caption}>{study.laptop.caption}</figcaption>
        </figure>

        <StudySection id="about" label="About">
          <p className={styles.body}>{study.about}</p>
          <dl className={`${styles.strip} ${local.aboutStrip}`}>
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt className={styles.metaLabel}>{fact.label}</dt>
                <dd className={styles.metaValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </StudySection>

        <StudySection id="approach" label="Approach">
          <h2 className={styles.question}>{study.approach.headline}</h2>
          <div className={styles.tiles}>
            {study.principles.map((frame) => (
              <figure key={frame.src} className={styles.tile}>
                <span className={styles.tileFrame}>
                  <Shot frame={frame} sizes={third} />
                </span>
                {frame.caption ? (
                  <figcaption className={styles.caption}>{frame.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
          <p className={styles.body}>
            <Parts parts={study.approach.why} />
          </p>
        </StudySection>

        {study.scenes.map((scene) => (
          <Headline key={scene.id} id={scene.id} eyebrow={scene.eyebrow} headline={scene.headline}>
            <p className={styles.body}>{scene.text}</p>
            {scene.clips.map((item) => (
              <ClipFigure key={item.mp4} clip={item} />
            ))}
          </Headline>
        ))}

        <Headline id="requests" eyebrow="Requests" headline={study.requests.headline}>
          <p className={styles.body}>{study.requests.text}</p>
          {study.requests.clips.map((item) => (
            <ClipFigure key={item.mp4} clip={item} />
          ))}
        </Headline>

        <StudySection id="system" label="Design system">
          <ol className={local.sheet}>
            <li className={local.item}>
              <p className={local.num}>01</p>
              <div>
                <h2 className={local.itemTitle}>Color</h2>
                <div className={local.swatches}>
                  {colors.map((color) => (
                    <figure key={color.hex} className={local.swatch}>
                      <span className={local.chip} style={{ background: color.hex }} />
                      <figcaption>
                        <p className={local.swatchName}>{color.name}</p>
                        <p className={local.hex}>
                          {color.hex} {color.token}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </li>
            <li className={local.item}>
              <p className={local.num}>02</p>
              <div>
                <h2 className={local.itemTitle}>Typography</h2>
                <div className={local.specimen}>
                  <p className={`${local.playfair} ${playfair.className}`}>
                    Beauty at your door, flavour on your table.
                  </p>
                  <p className={`${local.inter} ${inter.className}`}>
                    Book a hair appointment with a mobile stylist who comes to you.
                  </p>
                  <p className={local.face}>Playfair Display, 500. Inter, 400.</p>
                </div>
              </div>
            </li>
            <li className={local.item}>
              <p className={local.num}>03</p>
              <div>
                <h2 className={local.itemTitle}>Components</h2>
                <div className={`${local.components} ${inter.className}`}>
                  <div className={local.actions}>
                    <span className={local.roseBtn}>Request Booking</span>
                    <span className={local.oliveBtn}>Place Order</span>
                  </div>
                  <div className={local.field}>
                    <p className={local.fieldLabel}>
                      Preferred Date
                      <span className={local.fieldLine}>mm/dd/yyyy</span>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </StudySection>

        <StudySection id="outcome" label="Outcome">
          <p className={styles.body}>{study.outcome}</p>
          <div className={local.phones}>
            {study.phones.map((phone) => (
              <figure key={phone.mp4} className={local.phoneFigure}>
                <div className={local.phone}>
                  <div className={local.phoneScreen}>
                    <DeviceClip mp4={phone.mp4} poster={phone.poster} alt={phone.alt} />
                  </div>
                </div>
                <figcaption className={styles.caption}>{phone.caption}</figcaption>
              </figure>
            ))}
          </div>
          <h2 className={styles.subhead}>What I&apos;d do next</h2>
          <ul className={styles.list}>
            {study.nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </StudySection>
      </div>
    </StudyTemplate>
  );
}
