import { NextRequest, NextResponse } from "next/server";
import { createClient, createServerAdminClient } from "@/utils/supabase/server";
import { verifySession } from "@/lib/auth";
import type { TestimonialRow } from "@/types/service";

function requireAdmin(req: NextRequest) {
  const cookie = req.cookies.get("admin-session");
  if (!cookie) return false;
  return !!verifySession(cookie.value);
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, client_name, quote, rating, service_slug, is_featured, sort_order")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonials: (data ?? []) as TestimonialRow[] });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as Partial<TestimonialRow>;
  if (!body?.client_name || !body?.quote) {
    return NextResponse.json({ error: "client_name and quote are required" }, { status: 400 });
  }
  const supabase = createServerAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      client_name: body.client_name,
      quote: body.quote,
      rating: body.rating ?? 5,
      service_slug: body.service_slug ?? null,
      is_featured: body.is_featured ?? true,
      sort_order: body.sort_order ?? 0,
    })
    .select("id, client_name, quote, rating, service_slug, is_featured, sort_order")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonial: data });
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { updates: (Partial<TestimonialRow> & { id: number })[] };
  if (!Array.isArray(body?.updates) || body.updates.length === 0) {
    return NextResponse.json({ error: "updates required" }, { status: 400 });
  }
  const supabase = createServerAdminClient();
  for (const u of body.updates) {
    if (!u.id) continue;
    const { id, ...rest } = u;
    const { error } = await supabase.from("testimonials").update(rest).eq("id", id);
    if (error) return NextResponse.json({ error: error.message, id }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const supabase = createServerAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
