import { NextRequest, NextResponse } from "next/server";
import { createClient, createServerAdminClient } from "@/utils/supabase/server";
import { verifySession } from "@/lib/auth";
import type { ServicePatch, ServiceInput, ServiceRow } from "@/types/service";

function requireAdmin(req: NextRequest) {
  const cookie = req.cookies.get("admin-session");
  if (!cookie) return false;
  return !!verifySession(cookie.value);
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, category, description, features, price_from, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ services: (data ?? []) as ServiceRow[] });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as ServiceInput;
  if (!body?.slug || !body?.title || !body?.category) {
    return NextResponse.json({ error: "slug, title and category are required" }, { status: 400 });
  }
  const supabase = createServerAdminClient();
  const { data, error } = await supabase
    .from("services")
    .insert({
      slug: body.slug,
      title: body.title,
      category: body.category,
      description: body.description ?? null,
      features: body.features ?? [],
      price_from: body.price_from ?? null,
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
    })
    .select("id, slug, title, category, description, features, price_from, sort_order, is_active")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ service: data });
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { updates: ServicePatch[] };
  if (!Array.isArray(body?.updates) || body.updates.length === 0) {
    return NextResponse.json({ error: "updates array is required" }, { status: 400 });
  }
  const supabase = createServerAdminClient();
  const results = [];
  for (const u of body.updates) {
    if (!u.id) continue;
    const { id, ...rest } = u;
    const { data, error } = await supabase
      .from("services")
      .update(rest)
      .eq("id", id)
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message, id }, { status: 500 });
    results.push(data);
  }
  return NextResponse.json({ ok: true, count: results.length });
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const hard = searchParams.get("hard") === "1";
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const supabase = createServerAdminClient();
  const { error } = hard
    ? await supabase.from("services").delete().eq("id", id)
    : await supabase.from("services").update({ is_active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
