import { pickNoteColor } from "@/lib/notes";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { z } from "zod";

const noteSchema = z.object({
  name: z.string().trim().min(1).max(60),
  note: z.string().trim().min(1).max(500),
  page: z.string().trim().max(200).optional(),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`notes:${ip}`)) {
    return NextResponse.json(
      { ok: false, error: "Too many tries. Give it a little time, then try again." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Check the form and try again." },
      { status: 400 },
    );
  }

  const parsed = noteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Check the form and try again." },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.info("Note form (Supabase is not configured)", {
      name: parsed.data.name,
      note: parsed.data.note,
      page: parsed.data.page,
    });
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("notes").insert({
    name: parsed.data.name,
    body: parsed.data.note,
    page: parsed.data.page ?? null,
    color: pickNoteColor(Date.now()),
    approved: false,
  });

  if (error) {
    console.error("Could not save note", error.message);
    return NextResponse.json(
      { ok: false, error: "That did not go through. Try again in a moment." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
