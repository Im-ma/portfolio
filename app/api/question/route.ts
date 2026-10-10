import { sendQuestion } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.email(),
  question: z.string().trim().min(1).max(2000),
  quote: z.string().trim().max(400).optional(),
  source: z.string().trim().max(120).optional(),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`question:${ip}`)) {
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

  const parsed = questionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Check the form and try again." },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const result = await sendQuestion(parsed.data);
    return NextResponse.json({ ok: true, delivered: result.delivered });
  } catch {
    return NextResponse.json(
      { ok: false, error: "That did not go through. Try again in a moment." },
      { status: 500 },
    );
  }
}
