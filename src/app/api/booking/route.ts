import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/email";
import { createServerAdminClient } from "@/utils/supabase/server";

type BookingRequest = {
  service: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as BookingRequest;
  if (!body?.service || !body?.name || !body?.email || !body?.phone || !body?.date || !body?.time) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Persist booking and prevent double booking within a transaction-like flow
  const supabase = createServerAdminClient();
  // 1) Check if slot is available
  const slotKey = body.date;
  const avail = await supabase.from("availability").select("slots").eq("date", slotKey).maybeSingle();
  if (avail.error) return NextResponse.json({ error: avail.error.message }, { status: 500 });
  const currentSlots: string[] = (avail.data?.slots as string[]) || [];
  if (!currentSlots.includes(body.time)) {
    return NextResponse.json({ error: "Selected time is no longer available" }, { status: 409 });
  }
  // 2) Insert booking
  const insert = await supabase.from("bookings").insert({
    service: body.service,
    name: body.name,
    email: body.email,
    phone: body.phone,
    notes: body.notes ?? "",
    date: body.date,
    time: body.time,
  }).select("id").single();
  if (insert.error) return NextResponse.json({ error: insert.error.message }, { status: 500 });
  // 3) Remove the time slot from availability
  const newSlots = currentSlots.filter((t) => t !== body.time);
  const upd = await supabase.from("availability").update({ slots: newSlots }).eq("date", slotKey);
  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });
  // Send email confirmation (non-blocking for production robustness)
  try {
    await sendBookingEmail({
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      date: body.date,
      time: body.time,
      notes: body.notes,
    });
  } catch (_) {
    // Intentionally swallow email errors in production so booking still succeeds
  }

  return NextResponse.json({ ok: true });
}


