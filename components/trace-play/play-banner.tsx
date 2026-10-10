import Link from "next/link";
import styles from "./trace-play.module.css";

export function PlayBanner() {
  return (
    <aside className={styles.banner} aria-label="Experimental playable version">
      <p className="t-mono-label">Experimental playable version</p>
      <Link href="/work/trace">Standard version</Link>
    </aside>
  );
}
