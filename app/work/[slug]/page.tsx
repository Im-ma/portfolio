import { AskRoot } from "@/components/ask/ask-root";
import { CampusEventsStudy } from "@/components/case-study/campus-events-study";
import { CampusRideStudy } from "@/components/case-study/campus-ride-study";
import { UgsrcStudy } from "@/components/case-study/ugsrc-study";
import { CaseStudy } from "@/components/case-study/case-study";
import { JrunStudy } from "@/components/case-study/jrun-study";
import { LinkedFramesStudy } from "@/components/case-study/linked-frames/linked-frames";
import { Footer } from "@/components/footer/footer";
import { jrunStudy } from "@/content/work/jrun-llc";
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
  if (slug === jrunStudy.slug) {
    return {
      title: jrunStudy.title,
      description: jrunStudy.summary,
      openGraph: {
        title: `${jrunStudy.title} | Immanuel Mensah`,
        description: jrunStudy.summary,
        images: [
          {
            url: jrunStudy.hero.poster,
            width: jrunStudy.hero.width,
            height: jrunStudy.hero.height,
            alt: jrunStudy.hero.alt,
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
  if (slug === jrunStudy.slug) {
    return (
      <>
        <main id="content">
          <AskRoot source={jrunStudy.title}>
            <JrunStudy />
          </AskRoot>
        </main>
        <Footer />
      </>
    );
  }
  if (slug === "ugsrc") {
    const study = getWork(slug);
    if (!study) notFound();
    const typedStudy = asWork(study);
    return (
      <>
        <main id="content">
          <AskRoot source={typedStudy.title}>
            <UgsrcStudy work={typedStudy} />
          </AskRoot>
        </main>
        <Footer />
      </>
    );
  }
  if (slug === "campus-events") {
    const events = getWork(slug);
    if (!events) notFound();
    const typedEvents = asWork(events);
    return (
      <>
        <main id="content">
          <AskRoot source={typedEvents.title}>
            <CampusEventsStudy work={typedEvents} />
          </AskRoot>
        </main>
        <Footer />
      </>
    );
  }
  if (slug === "campus-ride") {
    const ride = getWork(slug);
    if (!ride) notFound();
    const typedRide = asWork(ride);
    return (
      <>
        <main id="content">
          <AskRoot source={typedRide.title}>
            <CampusRideStudy work={typedRide} />
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
