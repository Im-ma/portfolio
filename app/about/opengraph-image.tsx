import { aboutPage } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "About Immanuel Mensah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(aboutPage.intro.title, aboutPage.intro.eyebrow);
}
