import { ADMIN_COOKIE, adminConfigured, adminCookieValue } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Set ADMIN_PASSWORD before using this page." },
      { status: 400 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Enter the password." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(json);
  const token = adminCookieValue();
  if (!parsed.success || !token || parsed.data.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "That password does not match." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
