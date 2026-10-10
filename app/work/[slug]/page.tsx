import { ComingSoon } from "@/components/placeholder/coming-soon";
import { getWork, works } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  const image = "hero" in work && work.hero && typeof work.hero === "object" && "src" in work.hero
    ? String(work.hero.src)
    : undefined;
  return {
    title: work.title,
    description: work.summary,
    openGraph: {
      title: work.title,
      description: work.summary,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  return (
    <ComingSoon
      eyebrow={work.eyebrow}
      title={work.title}
      summary={work.summary}
      status={work.status}
      back={work.backLink}
    />
  );
}
