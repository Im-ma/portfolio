import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "notes_admin";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("portfolio-notes-admin").digest("hex");
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function tokensMatch(value: string | undefined) {
  const expected = expectedToken();
  if (!expected || !value) return false;
  const left = Buffer.from(value);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function adminCookieValue() {
  return expectedToken();
}

export async function isAdmin() {
  const jar = await cookies();
  return tokensMatch(jar.get(ADMIN_COOKIE)?.value);
}
