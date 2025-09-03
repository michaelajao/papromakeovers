import { NextRequest, NextResponse } from "next/server";
import { createClient, createServerAdminClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
  
  // Calculate the correct last day of the month
  const [year, monthNum] = month.split('-').map(Number);
  const lastDay = new Date(year, monthNum, 0).getDate(); // 0 gives us last day of previous month, so monthNum (not monthNum-1) gives us last day of monthNum
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability")
    .select("date, slots")
    .gte("date", `${month}-01`)
    .lte("date", `${month}-${lastDay.toString().padStart(2, '0')}`)
    .order("date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  type Row = { date: string; slots: string[] };
  const rows: Row[] = (data as unknown as Row[]) ?? [];
  const dates = rows.map((r) => r.date);
  const slotsByDate: Record<string, string[]> = {};
  rows.forEach((r) => {
    slotsByDate[r.date] = r.slots;
  });
  return NextResponse.json({ dates, slotsByDate }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const adminHeader = req.headers.get("x-admin-passcode");
  const pass = process.env.ADMIN_PASSCODE;
  if (!pass || adminHeader !== pass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { month: string; dates: string[]; slotsByDate: Record<string, string[]> };
  if (!body?.month || !Array.isArray(body?.dates) || typeof body?.slotsByDate !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const supabase = createServerAdminClient();
  // Clear existing rows for the month, then upsert new ones
  const [year, monthNum] = body.month.split('-').map(Number);
  const lastDay = new Date(year, monthNum, 0).getDate();
  const from = `${body.month}-01`;
  const to = `${body.month}-${lastDay.toString().padStart(2, '0')}`;
  const del = await supabase.from("availability").delete().gte("date", from).lte("date", to);
  if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });
  const rows = body.dates.map((d) => ({ date: d, slots: body.slotsByDate[d] || [] }));
  const ins = await supabase.from("availability").upsert(rows);
  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}


