import { ComingSoon } from "@/components/placeholder/coming-soon";
import { gatheringsPage } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gatherings",
  description: gatheringsPage.intro.lead,
};

export default function GatheringsPage() {
  return (
    <ComingSoon
      eyebrow={gatheringsPage.intro.eyebrow}
      title={gatheringsPage.intro.title}
      summary={gatheringsPage.intro.lead}
    />
  );
}
