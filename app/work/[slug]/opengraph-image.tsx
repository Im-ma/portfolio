import { jrunStudy } from "@/content/work/jrun-llc";
import { linkedFrames } from "@/content/work/linked-text-frames";
import { getWork } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Case study by Immanuel Mensah";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === linkedFrames.slug || slug === jrunStudy.slug) {
    const study = slug === linkedFrames.slug ? linkedFrames : jrunStudy;
    const file = await readFile(join(process.cwd(), "public", study.hero.poster));
    const src = `data:image/jpeg;base64,${file.toString("base64")}`;
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: slug === linkedFrames.slug ? "#D6EEE2" : "#F6F0E6",
        }}
      >
        <img
          src={src}
          alt=""
          width={1200}
          height={630}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>,
      { ...ogSize },
    );
  }
  const work = getWork(slug);
  return ogImage(work?.title ?? "Case study", work?.eyebrow ?? "CASE STUDY");
}
