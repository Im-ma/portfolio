import { ComingSoon } from "@/components/placeholder/coming-soon";
import { labPage } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
  description: labPage.intro.lead,
};

export default function LabPage() {
  return (
    <ComingSoon eyebrow={labPage.intro.eyebrow} title={labPage.intro.title} summary={labPage.intro.lead} />
  );
}
