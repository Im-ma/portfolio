import { AskRoot } from "@/components/ask/ask-root";
import { CaseStudy } from "@/components/case-study/case-study";
import { Footer } from "@/components/footer/footer";
import { AssistantDemo } from "@/components/trace-play/assistant-demo";
import { InspectDemo } from "@/components/trace-play/inspect-demo";
import { PlayBanner } from "@/components/trace-play/play-banner";
import { QuarantineConsole } from "@/components/trace-play/quarantine-console";
import { RestyleDemo } from "@/components/trace-play/restyle-demo";
import { getWork } from "@/lib/content";
import type { Work } from "@/lib/work-types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Trace, playable version",
  description: "A debug console for finding the bad records hiding in ML training data.",
  robots: { index: false, follow: false },
};

export default function TracePlayPage() {
  const work = getWork("trace");
  if (!work) notFound();

  return (
    <>
      <main id="content">
        <AskRoot source="Trace">
          <CaseStudy
            work={work as Work}
            banner={<PlayBanner />}
            decisionExtras={{
              1: <QuarantineConsole />,
              2: <AssistantDemo />,
              3: <InspectDemo />,
              4: <RestyleDemo />,
            }}
          />
        </AskRoot>
      </main>
      <Footer />
    </>
  );
}
