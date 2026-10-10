import { gatheringsPage } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Gatherings with Immanuel Mensah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(gatheringsPage.intro.title, gatheringsPage.intro.eyebrow);
}
