import Link from "next/link";
import styles from "./resume.module.css";

const pdf = "/resume.pdf";

export function ResumeView() {
  return (
    <div className={styles.page}>
      <div className="shell">
        <div className={styles.bar}>
          <Link className={styles.back} href="/">
            <span aria-hidden="true">←</span> Home
          </Link>
          <h1 className={styles.title}>Resume</h1>
          <a className={styles.download} href={pdf} download>
            Download PDF
          </a>
        </div>
        <div className={styles.stage}>
          <iframe
            className={styles.frame}
            src={`${pdf}#toolbar=0&navpanes=0&view=FitH`}
            title="Resume of Immanuel Mensah"
          />
        </div>
        <div className={styles.fallback}>
          <p className={`${styles.kicker} t-mono-label`}>PDF</p>
          <h2 className="t-heading-h3">Immanuel Mensah</h2>
          <p className={`${styles.note} t-body-m`}>Download the PDF to read it on your phone.</p>
          <a className={styles.download} href={pdf} download>
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
