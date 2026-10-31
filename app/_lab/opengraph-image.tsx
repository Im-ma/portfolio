import { labPage } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Lab experiments by Immanuel Mensah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(labPage.intro.title, labPage.intro.eyebrow);
}
