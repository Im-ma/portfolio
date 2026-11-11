import { AskRoot } from "@/components/ask/ask-root";
import { CaseStudy } from "@/components/case-study/case-study";
import { LinkedFramesStudy } from "@/components/case-study/linked-frames/linked-frames";
import { Footer } from "@/components/footer/footer";
import { linkedFrames } from "@/content/work/linked-text-frames";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === linkedFrames.slug) {
    return {
      title: linkedFrames.title,
      description: linkedFrames.summary,
      openGraph: {
        title: `${linkedFrames.title} | Immanuel Mensah`,
        description: linkedFrames.summary,
        images: [
          {
            url: linkedFrames.hero.poster,
            width: linkedFrames.hero.width,
            height: linkedFrames.hero.height,
            alt: linkedFrames.hero.alt,
          },
        ],
      },
    };
  }
  const work = getWork(slug);
  if (!work) return {};
  const typed = asWork(work);
  return {
    title: typed.title,
    description: typed.summary,
    openGraph: {
      title: typed.title,
      description: typed.summary,
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  if (slug === linkedFrames.slug) {
    return (
      <>
        <main id="content">
          <AskRoot source={linkedFrames.title}>
            <LinkedFramesStudy />
          </AskRoot>
        </main>
        <Footer />
      </>
    );
  }
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
