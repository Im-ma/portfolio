import { home } from "@/lib/content";
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

const sampleNotes = home.gatheringsTeaser.noteWall.notes;

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

/** Latest approved notes sit on the home teaser slots. Samples stay until real notes exist. */
export function homeTeaserNotes(live: StoredNote[]): WallNote[] {
  if (live.length === 0) {
    return sampleNotes.map((note) => ({
      text: note.text,
      signature: note.signature,
      rotation: note.rotation,
      color: asColor(note.color, 0),
      attachment: note.attachment === "pin" ? "pin" : "tape",
      check: note.check,
      checkNote: note.checkNote,
    }));
  }
  return sampleNotes.map((slot, index) => {
    const note = live[index];
    if (!note) {
      return {
        text: slot.text,
        signature: slot.signature,
        rotation: slot.rotation,
        color: asColor(slot.color, index),
        attachment: slot.attachment === "pin" ? "pin" : "tape",
        check: slot.check,
        checkNote: slot.checkNote,
      };
    }
    return {
      text: note.body,
      signature: `- ${note.name}`,
      rotation: slot.rotation,
      color: asColor(note.color, index),
      attachment: slot.attachment === "pin" ? "pin" : "tape",
    };
  });
}

export function pickNoteColor(seed: number): NoteColor {
  return NOTE_COLORS[Math.abs(seed) % NOTE_COLORS.length];
}
