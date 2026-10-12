import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseMode = "service" | "anon" | "off";

export function supabaseMode(): SupabaseMode {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return "off";
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return "service";
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return "anon";
  return "off";
}

let client: SupabaseClient | null = null;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
