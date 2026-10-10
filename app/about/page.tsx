import { AboutView } from "@/components/about/about-view";
import { Footer } from "@/components/footer/footer";
import { aboutPage } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: aboutPage.intro.lead,
  openGraph: {
    title: aboutPage.intro.title,
    description: aboutPage.intro.lead,
  },
};

export default function AboutPage() {
  return (
    <>
      <main id="content">
        <AboutView />
      </main>
      <Footer />
    </>
  );
}
