"use client";

import { site } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import styles from "./nav.module.css";

function isActive(pathname: string, href: string) {
  if (href === "/#work") return pathname.startsWith("/work");
  return pathname === href;
}

type NavItem = (typeof site.nav)[number];

function navItems(): NavItem[] {
  if (site.nav.some((item) => item.href === "/lab")) return site.nav;
  const lab: NavItem = { number: "04", label: "Lab", href: "/lab", external: false };
  const items: NavItem[] = [];
  for (const item of site.nav) {
    if (item.href === "/resume.pdf") {
      items.push(lab);
      items.push({ ...item, number: "05" });
    } else {
      items.push(item);
    }
  }
  return items;
}

export function Nav() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (value: boolean) => setOpenPath(value ? pathname : null);
  const sheetId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("[data-talk-dialog]")) {
        setOpenPath(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = navItems();
  const items = links.map((item) => {
    const active = isActive(pathname, item.href);
    const className = `${styles.link} t-body-nav${active ? ` ${styles.active}` : ""}`;
    const content = (
      <>
        <span className={`${styles.num} t-mono-small`}>{item.number}</span>
        {item.label}
      </>
    );
    if (item.external) {
      return (
        <a
          key={item.href}
          className={className}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        key={item.href}
        className={className}
        href={item.href}
        aria-current={active ? "page" : undefined}
      >
        {content}
      </Link>
    );
  });

  return (
    <header className={styles.header}>
      <div className={`shell ${styles.bar}`}>
        <Link className={styles.logo} href="/" aria-label="Immanuel Mensah, home">
          <span className={styles.mark} aria-hidden="true" />
          <span className="t-heading-logo">{site.logo}</span>
        </Link>
        <div className={styles.desktop}>
          <nav aria-label="Primary">
            <ul className={styles.links}>
              {links.map((item) => (
                <li key={item.href}>{items.find((node) => node.key === item.href)}</li>
              ))}
            </ul>
          </nav>
          <p className={`${styles.chip} t-mono-small`}>
            <span className={styles.dot} aria-hidden="true" />
            {site.availability}
          </p>
        </div>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? (
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14M5 12h14M5 16h14" />
            </svg>
          )}
        </button>
      </div>
      {open ? (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav id={sheetId} className={styles.sheet} aria-label="Primary">
            {links.map((item) => {
              const active = isActive(pathname, item.href);
              const content = (
                <>
                  <span className={`${styles.num} t-mono-small`}>{item.number}</span>
                  <span className={`t-body-nav${active ? ` ${styles.active}` : ""}`}>
                    {item.label}
                  </span>
                </>
              );
              if (item.external) {
                return (
                  <a
                    key={item.href}
                    className={styles.sheetLink}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={item.href}
                  className={styles.sheetLink}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  {content}
                </Link>
              );
            })}
            <p className={`${styles.chip} t-mono-small`}>
              <span className={styles.dot} aria-hidden="true" />
              {site.availability}
            </p>
          </nav>
        </>
      ) : null}
    </header>
  );
}
