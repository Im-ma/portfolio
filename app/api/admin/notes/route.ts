import { isAdmin } from "@/lib/admin-auth";
import { getSupabase, supabaseMode } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  id: z.uuid(),
  approved: z.boolean(),
});

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Sign in first." }, { status: 401 });
  }
  if (supabaseMode() !== "service") {
    return NextResponse.json(
      { ok: false, error: "Approving from this page needs SUPABASE_SERVICE_ROLE_KEY." },
      { status: 400 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Missing note." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Missing note." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase is not configured." }, { status: 400 });
  }

  const { error } = await supabase
    .from("notes")
    .update({ approved: parsed.data.approved })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("Could not update note", error.message);
    return NextResponse.json(
      { ok: false, error: "That did not go through. Try again in a moment." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
