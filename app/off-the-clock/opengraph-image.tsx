import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Off the clock with Immanuel Mensah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage("A loose pile of photos.", "Off the clock");
}
