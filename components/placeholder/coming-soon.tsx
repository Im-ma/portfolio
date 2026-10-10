import { AskRoot } from "@/components/ask/ask-root";
import { Button } from "@/components/button/button";
import { Check } from "@/components/check/check";
import { Footer } from "@/components/footer/footer";
import { StatusTag } from "@/components/status-tag/status-tag";
import Link from "next/link";
import styles from "./coming-soon.module.css";

export function ComingSoon({
  eyebrow,
  title,
  summary,
  status,
  back,
}: {
  eyebrow: string;
  title: string;
  summary?: string;
  status?: string;
  back?: { label: string; href: string };
}) {
  return (
    <>
      <main id="content" className={styles.main}>
        <div className="shell">
          <p className={`${styles.eyebrow} t-mono-label`}>{eyebrow}</p>
          <h1 className={`${styles.title} t-display-h1-case`}>{title}</h1>
          {status ? (
            <div className={styles.row}>
              <StatusTag status={status} />
            </div>
          ) : null}
          {summary ? (
            <AskRoot source={title}>
              <p className={`${styles.lead} t-body-l`}>{summary}</p>
            </AskRoot>
          ) : null}
          <p className={`${styles.lead} t-body-m`}>
            Coming next round.
            <Check note="placeholder page" />
          </p>
          <div className={styles.row}>
            {back ? (
              <Link className={`${styles.back} t-mono-small`} href={back.href}>
                <span aria-hidden="true">← </span>
                {back.label}
              </Link>
            ) : null}
            <Button href="/" variant="secondary">
              Back home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
