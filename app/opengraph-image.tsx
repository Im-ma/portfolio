import { home } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Immanuel Mensah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(home.hero.title, "PORTFOLIO");
}
