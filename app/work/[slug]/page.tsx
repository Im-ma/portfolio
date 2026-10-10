import { AskRoot } from "@/components/ask/ask-root";
import { CaseStudy } from "@/components/case-study/case-study";
import { Footer } from "@/components/footer/footer";
import { getWork, works } from "@/lib/content";
import type { Work } from "@/lib/work-types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export const dynamicParams = false;

function asWork(value: unknown) {
  return value as Work;
}

function resultImage(work: Work) {
  const section = work.sections.find((item) => item.id === "the-result");
  const figure = section?.blocks.find((block) => block.type === "figure");
  if (!figure || figure.type !== "figure") return undefined;
  return figure.src ?? figure.images?.[0]?.src;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  const typed = asWork(work);
  const image = resultImage(typed);
  return {
    title: typed.title,
    description: typed.summary,
    openGraph: {
      title: typed.title,
      description: typed.summary,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const typed = asWork(work);
  return (
    <>
      <main id="content">
        <AskRoot source={typed.title}>
          <CaseStudy work={typed} />
        </AskRoot>
      </main>
      <Footer />
    </>
  );
}
