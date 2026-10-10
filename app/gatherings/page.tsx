import { Footer } from "@/components/footer/footer";
import { GatheringsView } from "@/components/gatherings/gatherings-view";
import { gatheringsPage } from "@/lib/content";
import { getApprovedNotes, placeWallNotes } from "@/lib/notes";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gatherings",
  description: gatheringsPage.intro.lead,
};

export default async function GatheringsPage() {
  const live = await getApprovedNotes();
  const notes = placeWallNotes(live, gatheringsPage.noteWall.notes);
  return (
    <>
      <main id="content">
        <GatheringsView notes={notes} />
      </main>
      <Footer />
    </>
  );
}
