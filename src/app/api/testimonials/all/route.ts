import { NextResponse } from "next/server";
import { createServerAdminClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { TestimonialRow } from "@/types/service";

// Admin-only: returns ALL testimonials (including unfeatured) for the admin UI.
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createServerAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, client_name, quote, rating, service_slug, is_featured, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonials: (data ?? []) as TestimonialRow[] });
}
