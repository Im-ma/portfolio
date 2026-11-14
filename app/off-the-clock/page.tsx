import { OffTheClockView } from "@/components/off-the-clock/off-the-clock-view";
import { noteWall } from "@/lib/content";
import { getApprovedNotes, placeWallNotes } from "@/lib/notes";
import type { Metadata } from "next";

export const revalidate = 300;

const description = "Me, the work on my desk, and a few days with people.";

export const metadata: Metadata = {
  title: "Off the clock",
  description,
  openGraph: {
    title: "A loose pile of photos.",
    description,
  },
};

export default async function OffTheClockPage() {
  const live = await getApprovedNotes();
  const notes = placeWallNotes(live, noteWall.notes);
  return <OffTheClockView notes={notes} />;
}
