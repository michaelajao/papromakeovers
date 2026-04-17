import { createClient, createServerAdminClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Returns the signed-in admin user, or null if the visitor is not signed in
 * or is signed in as a non-admin. API routes should return 401 when null.
 */
export async function requireAdmin(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createServerAdminClient();
  const { data, error } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return user;
}
