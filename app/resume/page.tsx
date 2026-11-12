import { Footer } from "@/components/footer/footer";
import { ResumeView } from "@/components/resume/resume-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume for Immanuel Mensah.",
  openGraph: {
    title: "Resume",
    description: "Resume for Immanuel Mensah.",
  },
};

export default function ResumePage() {
  return (
    <>
      <main id="content">
        <ResumeView />
      </main>
      <Footer />
    </>
  );
}
