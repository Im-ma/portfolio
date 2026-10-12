import Link from "next/link";
import styles from "./section-header.module.css";

export function SectionHeader({
  number,
  title,
  link,
  aside,
}: {
  number: string;
  title: string;
  link?: { label: string; href: string };
  aside?: React.ReactNode;
}) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>
        <span className={`${styles.num} t-mono-number`}>
          {number}
          {"  /"}
        </span>
        <span className="t-heading-h2">{title}</span>
      </h2>
      {link ? (
        <Link className={`${styles.link} t-body-nav`} href={link.href}>
          {link.label} <span aria-hidden="true">→</span>
        </Link>
      ) : aside ? (
        <div className={styles.aside}>{aside}</div>
      ) : null}
    </div>
  );
}
