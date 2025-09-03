import { NextRequest, NextResponse } from "next/server";
import { createServerAdminClient } from "@/utils/supabase/server";

function getMonthRange(month: string) {
  // month in YYYY-MM
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const m = Number(monthStr);
  const start = new Date(Date.UTC(year, m - 1, 1));
  const end = new Date(Date.UTC(year, m, 0));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export async function GET(req: NextRequest) {
  const adminHeader = req.headers.get("x-admin-passcode");
  const pass = process.env.ADMIN_PASSCODE;
  if (!pass || adminHeader !== pass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  if (!month) {
    return NextResponse.json({ error: "Missing month" }, { status: 400 });
  }

  const { start, end } = getMonthRange(month);
  const supabase = createServerAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, name, email, phone, service, date, time, status, created_at")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const adminHeader = req.headers.get("x-admin-passcode");
  const pass = process.env.ADMIN_PASSCODE;
  if (!pass || adminHeader !== pass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { id: number; action: "accept" | "cancel" };
  if (!body?.id || !body?.action) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createServerAdminClient();

  const { data: booking, error: fetchErr } = await supabase
    .from("bookings")
    .select("id, date, time, status")
    .eq("id", body.id)
    .single();
  if (fetchErr || !booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  if (body.action === "accept") {
    // Mark confirmed (idempotent) and ensure slot is removed from availability
    const upd = await supabase.from("bookings").update({ status: "confirmed" }).eq("id", body.id);
    if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });

    // Remove slot from availability
    const avail = await supabase.from("availability").select("slots").eq("date", booking.date).maybeSingle();
    if (!avail.error && avail.data) {
      const currentSlots: string[] = (avail.data.slots as string[]) || [];
      const filtered = currentSlots.filter((t) => t !== booking.time);
      if (filtered.length !== currentSlots.length) {
        const updAvail = await supabase.from("availability").update({ slots: filtered }).eq("date", booking.date);
        if (updAvail.error) return NextResponse.json({ error: updAvail.error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true });
  }

  // Cancel: mark cancelled and add slot back to availability
  if (body.action === "cancel") {
    const upd = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", body.id);
    if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });

    // Re-add slot to availability (if not already present)
    const avail = await supabase.from("availability").select("slots").eq("date", booking.date).maybeSingle();
    if (avail.error) return NextResponse.json({ error: avail.error.message }, { status: 500 });
    if (avail.data) {
      const currentSlots: string[] = (avail.data.slots as string[]) || [];
      if (!currentSlots.includes(booking.time)) {
        const updated = [...currentSlots, booking.time].sort();
        const updAvail = await supabase.from("availability").update({ slots: updated }).eq("date", booking.date);
        if (updAvail.error) return NextResponse.json({ error: updAvail.error.message }, { status: 500 });
      }
    } else {
      // No availability row yet for this date; create it with the time slot
      const ins = await supabase.from("availability").insert({ date: booking.date, slots: [booking.time] });
      if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}


