import { CoverVideo } from "@/components/media/cover-video";
import styles from "./solution-film.module.css";

export function SolutionFilm({
  mp4,
  webm,
  poster,
  label,
}: {
  mp4: string;
  webm: string;
  poster: string;
  label: string;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.film}>
        <CoverVideo
          mp4={mp4}
          webm={webm}
          poster={poster}
          field="var(--color-neutral-soft)"
          label={label}
        />
      </div>
      <figcaption className={`${styles.credit} t-body-xs`}>
        Map:{" "}
        <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">
          OpenFreeMap
        </a>{" "}
        © OpenMapTiles Data from{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          OpenStreetMap
        </a>
      </figcaption>
    </figure>
  );
}
