import { Check } from "@/components/check/check";
import styles from "./tool-chip.module.css";

export function ToolChip({
  text,
  check,
  checkNote,
}: {
  text: string;
  check?: boolean;
  checkNote?: string;
}) {
  return (
    <span className={`${styles.chip} t-mono-small`}>
      {text}
      {check ? <Check note={checkNote} /> : null}
    </span>
  );
}
