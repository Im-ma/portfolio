import { getSupabase } from "@/lib/supabase";

export const NOTE_COLORS = ["yellow", "cobalt", "green", "pink"] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

export type StoredNote = {
  id: string;
  name: string;
  body: string;
  page: string | null;
  color: NoteColor;
  approved: boolean;
  createdAt: string;
};

export type WallNote = {
  text: string;
  signature: string;
  rotation: number;
  color: NoteColor;
  attachment: "tape" | "pin";
  check?: boolean;
  checkNote?: string;
};

const homeLayouts: { rotation: number; attachment: "tape" | "pin" }[] = [
  { rotation: -3, attachment: "tape" },
  { rotation: 2, attachment: "pin" },
  { rotation: -1, attachment: "tape" },
];

function asColor(value: string | null | undefined, index: number): NoteColor {
  if (value && NOTE_COLORS.includes(value as NoteColor)) return value as NoteColor;
  return NOTE_COLORS[index % NOTE_COLORS.length];
}

function mapRow(row: {
  id: string;
  name: string;
  body: string;
  page: string | null;
  color: string | null;
  approved: boolean;
  created_at: string;
}): StoredNote {
  return {
    id: row.id,
    name: row.name,
    body: row.body,
    page: row.page,
    color: asColor(row.color, 0),
    approved: row.approved,
    createdAt: row.created_at,
  };
}

export async function getApprovedNotes(): Promise<StoredNote[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notes")
    .select("id, name, body, page, color, approved, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error || !data) {
    console.error("Could not read approved notes", error?.message);
    return [];
  }
  return data.map((row) => mapRow(row));
}

export async function getAllNotes(): Promise<StoredNote[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notes")
    .select("id, name, body, page, color, approved, created_at")
    .order("created_at", { ascending: false });
  if (error || !data) {
    console.error("Could not read notes", error?.message);
    return [];
  }
  return data.map((row) => mapRow(row));
}

/** The three newest approved notes on the home teaser. Empty when none are approved. */
export function homeTeaserNotes(live: StoredNote[]): WallNote[] {
  return live.slice(0, homeLayouts.length).map((note, index) => {
    const slot = homeLayouts[index] ?? homeLayouts[0];
    return {
      text: note.body,
      signature: `- ${note.name}`,
      rotation: slot.rotation,
      color: asColor(note.color, index),
      attachment: slot.attachment,
    };
  });
}

export function pickNoteColor(seed: number): NoteColor {
  return NOTE_COLORS[Math.abs(seed) % NOTE_COLORS.length];
}

export type NoteSlot = {
  attachment?: string | null;
  layout: { x: number; y: number; width: number; height: number; rotation: number };
};

export type PlacedNote = WallNote & { x: number; y: number; width: number; height: number };

/** Approved notes fill the wall slots in order. Extra notes reuse a slot a little lower. */
export function placeWallNotes(live: StoredNote[], slots: NoteSlot[]): PlacedNote[] {
  if (slots.length === 0) return [];
  return live.map((note, index) => {
    const slot = slots[index % slots.length];
    const cycle = Math.floor(index / slots.length);
    return {
      text: note.body,
      signature: `- ${note.name}`,
      rotation: slot.layout.rotation,
      color: asColor(note.color, index),
      attachment: slot.attachment === "pin" ? "pin" : "tape",
      x: slot.layout.x,
      y: slot.layout.y + cycle * 28,
      width: slot.layout.width,
      height: slot.layout.height,
    };
  });
}
