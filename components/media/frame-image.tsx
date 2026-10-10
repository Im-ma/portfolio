import { showChecks } from "@/lib/show-checks";
import Image from "next/image";
import styles from "./frame-image.module.css";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  radius?: number;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  standin?: boolean;
  priority?: boolean;
  fillFrame?: boolean;
  className?: string;
};

export function FrameImage({
  src,
  alt,
  sizes,
  radius = 0,
  objectFit = "cover",
  objectPosition = "center",
  standin = false,
  priority = false,
  fillFrame = false,
  className,
}: Props) {
  return (
    <span
      className={`${styles.frame} ${fillFrame ? styles.fill : ""} ${className ?? ""}`}
      style={{ borderRadius: radius }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        style={{ objectFit, objectPosition }}
      />
      {standin && showChecks() ? <span className={styles.tag}>STAND-IN</span> : null}
    </span>
  );
}
