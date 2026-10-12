import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { Footer } from "@/components/footer/footer";
import { StickyNote } from "@/components/sticky-note/sticky-note";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <main id="content" className={styles.main}>
        <div className={`shell ${styles.grid}`}>
          <div>
            <h1 className="t-display-h1">
              This page wandered off.
              <Check note="404 heading" />
            </h1>
            <p className={`${styles.lead} t-body-l`}>
              Nothing lives at this address.
              <Check note="404 body" />
            </p>
            <p className={`${styles.hint} t-mono-small`}>Press T to pull up a chair.</p>
            <Button href="/">Back home</Button>
          </div>
          <div aria-hidden="true">
            <StickyNote
              text="Nothing lives at this address."
              rotation={-3}
              color="yellow"
              attachment="tape"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
