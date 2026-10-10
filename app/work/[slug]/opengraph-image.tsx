import { getWork } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Case study by Immanuel Mensah";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  return ogImage(work?.title ?? "Case study", work?.eyebrow ?? "CASE STUDY");
}
