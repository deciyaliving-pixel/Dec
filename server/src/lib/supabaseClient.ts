import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey);

let client: SupabaseClient | null = null;

/**
 * Server-side admin client, authenticated with the service role key so the repository
 * layer can bypass RLS — authorization is instead enforced explicitly in route
 * handlers and the repository's isEditor() check. Never expose this key to the client.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or use the local seed-backed repository for development.",
    );
  }
  if (!client) {
    client = createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}
