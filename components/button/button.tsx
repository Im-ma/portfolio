import Link from "next/link";
import styles from "./button.module.css";

type ButtonProps = {
  variant?: "primary" | "secondary";
  arrow?: boolean;
  children: React.ReactNode;
  className?: string;
  full?: boolean;
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button(props: ButtonProps) {
  const className = [
    styles.btn,
    styles[props.variant ?? "primary"],
    props.full ? styles.full : "",
    "t-button-m",
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {props.children}
      {props.arrow ? <span aria-hidden="true">→</span> : null}
    </>
  );

  if ("href" in props && props.href) {
    const external = props.external || /^https?:/i.test(props.href);
    if (external || props.href.startsWith("mailto:") || props.href.endsWith(".pdf")) {
      const newTab = !props.href.startsWith("mailto:");
      return (
        <a
          className={className}
          href={props.href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }
    if (props.href.startsWith("#") || props.href.startsWith("/#")) {
      return (
        <a className={className} href={props.href}>
          {content}
        </a>
      );
    }
    return (
      <Link className={className} href={props.href}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {content}
    </button>
  );
}
