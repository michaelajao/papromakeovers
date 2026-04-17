import { NextResponse } from "next/server";
import { createServerAdminClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { ServiceRow } from "@/types/service";

// Admin-only: returns ALL services (including inactive/soft-deleted)
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createServerAdminClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, category, description, features, price_from, sort_order, is_active")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ services: (data ?? []) as ServiceRow[] });
}
