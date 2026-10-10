import { HomeView } from "@/components/home/home-view";
import { home } from "@/lib/content";
import { getApprovedNotes, homeTeaserNotes } from "@/lib/notes";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Immanuel Mensah" },
  description: home.hero.lead,
  openGraph: {
    title: "Immanuel Mensah",
    description: home.hero.lead,
    images: [{ url: home.hero.portrait.src, alt: home.hero.portrait.alt }],
  },
};

export default async function HomePage() {
  const live = await getApprovedNotes();
  const notes = homeTeaserNotes(live);
  return <HomeView notes={notes} />;
}
