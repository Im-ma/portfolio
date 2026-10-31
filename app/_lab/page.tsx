import { Footer } from "@/components/footer/footer";
import { LabBoard } from "@/components/lab/lab-board";
import { labPage } from "@/lib/content";
import type { Metadata } from "next";
import styles from "@/components/lab/lab.module.css";

export const metadata: Metadata = {
  title: "Lab",
  description: labPage.intro.lead,
  openGraph: {
    title: labPage.intro.title,
    description: labPage.intro.lead,
  },
};

export default function LabPage() {
  return (
    <>
      <main id="content">
        <header className={styles.intro}>
          <div className="shell">
            <p className={`${styles.eyebrow} t-mono-label`}>{labPage.intro.eyebrow}</p>
            <h1 className="t-display-h1-case">{labPage.intro.title}</h1>
            <p className={`${styles.lead} t-body-l`}>{labPage.intro.lead}</p>
          </div>
        </header>
        <section className={styles.section} aria-label="Experiments">
          <div className="shell">
            <LabBoard />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
