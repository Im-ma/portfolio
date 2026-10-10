import { ComingSoon } from "@/components/placeholder/coming-soon";
import { aboutPage } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: aboutPage.intro.lead,
};

export default function AboutPage() {
  return (
    <ComingSoon
      eyebrow={aboutPage.intro.eyebrow}
      title={aboutPage.intro.title}
      summary={aboutPage.intro.lead}
    />
  );
}
