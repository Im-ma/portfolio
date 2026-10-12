import { Check } from "@/components/check/check";
import type { NoteColor } from "@/lib/notes";
import styles from "./sticky-note.module.css";

const colors: Record<NoteColor, string> = {
  yellow: styles.yellow,
  cobalt: styles.cobalt,
  green: styles.green,
  pink: styles.pink,
};

export function StickyNote({
  text,
  signature,
  rotation,
  color,
  attachment,
  check,
  checkNote,
  sway = false,
  plain = false,
}: {
  text: string;
  signature?: string;
  rotation: number;
  color: NoteColor;
  attachment: "tape" | "pin";
  check?: boolean;
  checkNote?: string;
  sway?: boolean;
  plain?: boolean;
}) {
  const dir = rotation < 0 ? -1 : 1;
  const tilt = rotation < 0 ? -1.5 : 1.5;
  return (
    <article
      className={`${styles.note} ${colors[color]} ${plain ? styles.plain : ""}`}
      style={
        plain
          ? undefined
          : {
              ["--rot" as string]: `${rotation}deg`,
              ["--tilt" as string]: `${tilt}deg`,
              ["--dir" as string]: dir,
              animation: sway ? undefined : "none",
            }
      }
    >
      {attachment === "tape" ? <span className={styles.tape} aria-hidden="true" /> : null}
      {attachment === "pin" ? <span className={styles.pin} aria-hidden="true" /> : null}
      <p className={styles.text}>
        {text}
        {check ? <Check note={checkNote} /> : null}
      </p>
      {signature ? (
        <span className={`${styles.signature} t-hand-signature`}>{signature}</span>
      ) : null}
    </article>
  );
}
