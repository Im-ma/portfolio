import captions from "@/public/off-the-clock/captions.json";
import type { Shape } from "@/lib/pile-layout";

export type ClockItem = {
  id: string;
  src: string;
  video: string | null;
  caption: string;
  category: string;
  shape: Shape;
  fit: "cover" | "contain";
  position: string;
};

/** Pixel size of the photo, or of the video poster. */
const frames: Record<string, readonly [number, number]> = {
  "me-smile.jpg": [1200, 1600],
  "me-sky.jpg": [1200, 1600],
  "me-headphones.jpg": [900, 1600],
  "me-bible.jpg": [1200, 1600],
  "me-pulpit.jpg": [901, 1600],
  "me-robot.jpg": [1200, 1600],
  "me-museum.mp4": [900, 1600],
  "me-library.jpg": [1200, 1600],
  "me-laptop-stickers.jpg": [1600, 1168],
  "me-jacket-tie.jpg": [900, 1600],
  "me-room.mp4": [900, 1600],
  "me-goofy.mp4": [1600, 900],
  "design-akoo.jpg": [1600, 900],
  "design-desk.jpg": [1600, 1200],
  "design-welcome.jpg": [1200, 1600],
  "design-beauty.jpg": [1200, 1600],
  "design-logo.jpg": [1200, 1600],
  "design-print.jpg": [1600, 1200],
  "design-booth.jpg": [1600, 1200],
  "design-merch.jpg": [1200, 1600],
  "design-layouts.jpg": [1200, 1600],
  "design-sankofa.jpg": [1200, 1600],
  "design-logo-motion.jpg": [1200, 1600],
  "design-alabaster.jpg": [1200, 1600],
  "design-helios.jpg": [1200, 1600],
  "design-exercise-book.jpg": [1200, 1600],
  "design-couples-camp.jpg": [1200, 1600],
  "design-urbanbite.jpg": [1200, 1600],
  "design-executives.jpg": [1200, 1600],
  "design-salon.jpg": [1200, 1600],
  "design-welcome-alt.jpg": [1200, 1600],
  "design-nsakina.jpg": [1200, 1600],
  "design-birthday.jpg": [1200, 1600],
  "design-organizing.jpg": [1200, 1600],
  "design-vice-president.jpg": [1200, 1600],
  "design-financial.jpg": [1200, 1600],
  "design-thanksgiving.jpg": [1200, 1600],
  "design-cargon.jpg": [1200, 1600],
  "design-base44.jpg": [1200, 1600],
  "design-vicaz.jpg": [1200, 1600],
  "design-file-folder.jpg": [1200, 1600],
  "design-gdcl-board.jpg": [1200, 1600],
  "design-campus-ride-home.jpg": [1200, 1600],
  "design-campus-ride-screens.jpg": [1200, 1600],
  "design-campus-ride-cards.jpg": [1368, 1600],
  "gather-team.jpg": [1206, 891],
  "gather-courtyard.jpg": [1600, 1200],
  "gather-car.jpg": [1200, 1600],
  "gather-table.jpg": [1200, 1600],
  "gather-game.mp4": [900, 1600],
  "gather-fair.mp4": [900, 1600],
  "gather-polo.jpg": [1200, 1600],
  "gather-night.jpg": [1200, 1600],
  "gather-laptops.jpg": [1600, 1200],
  "gather-office.jpg": [1080, 810],
  "gather-walk.jpg": [768, 1024],
  "gather-study-group.jpg": [1600, 1200],
};

function shapeFor(width: number, height: number): Shape {
  const ratio = width / height;
  if (ratio >= 1.45) return "wide";
  if (ratio >= 1.05) return "land";
  return "tall";
}

function objectPosition(file: string, category: string, shape: Shape) {
  if (file === "me-smile.jpg") return "center 84%";
  if (file === "me-bible.jpg") return "center 70%";
  if (file === "me-goofy.mp4") return "left center";
  if (category === "me" && shape === "tall") return "center 62%";
  return "center";
}

export const clockItems: ClockItem[] = captions.map((item) => {
  const frame = frames[item.file];
  if (!frame) throw new Error(`Missing frame size for ${item.file}`);
  const [width, height] = frame;
  const shape = shapeFor(width, height);
  const poster = item.poster ? `/off-the-clock/${item.poster}` : null;
  return {
    id: item.file.replace(/\.(jpg|mp4)$/i, ""),
    caption: item.caption,
    category: item.category,
    shape,
    fit: item.file === "design-akoo.jpg" ? "contain" : "cover",
    position: objectPosition(item.file, item.category, shape),
    src: item.type === "video" && poster ? poster : `/off-the-clock/${item.file}`,
    video: item.type === "video" ? `/off-the-clock/${item.file}` : null,
  };
});
