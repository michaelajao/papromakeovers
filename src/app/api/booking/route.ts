import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/email";
import { createServerAdminClient } from "@/utils/supabase/server";
import { withRateLimit, bookingRateLimit } from "@/lib/rate-limit";

type BookingRequest = {
  service: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  date: string;
  time: string;
};

async function handleBooking(req: NextRequest) {
  const body = (await req.json()) as BookingRequest;
  if (!body?.service || !body?.name || !body?.email || !body?.phone || !body?.date || !body?.time) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServerAdminClient();

  const serviceLookup = await supabase
    .from("services")
    .select("title, price_from")
    .eq("slug", body.service)
    .maybeSingle();
  const serviceTitle = (serviceLookup.data?.title as string | undefined) ?? body.service;
  const servicePrice = (serviceLookup.data?.price_from as number | null | undefined) ?? null;

  const slotKey = body.date;
  const avail = await supabase.from("availability").select("slots").eq("date", slotKey).maybeSingle();
  if (avail.error) return NextResponse.json({ error: avail.error.message }, { status: 500 });
  const currentSlots: string[] = (avail.data?.slots as string[]) || [];
  if (!currentSlots.includes(body.time)) {
    return NextResponse.json({ error: "Selected time is no longer available" }, { status: 409 });
  }

  const insert = await supabase
    .from("bookings")
    .insert({
      service: body.service,
      name: body.name,
      email: body.email,
      phone: body.phone,
      notes: body.notes ?? "",
      date: body.date,
      time: body.time,
      price: servicePrice,
    })
    .select("id")
    .single();
  if (insert.error) return NextResponse.json({ error: insert.error.message }, { status: 500 });

  const newSlots = currentSlots.filter((t) => t !== body.time);
  const upd = await supabase.from("availability").update({ slots: newSlots }).eq("date", slotKey);
  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });

  try {
    await sendBookingEmail({
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      serviceTitle,
      priceFrom: servicePrice,
      date: body.date,
      time: body.time,
      notes: body.notes,
    });
  } catch {
    // swallow email errors so the booking still succeeds
  }

  return NextResponse.json({ ok: true });
}

export const POST = withRateLimit(bookingRateLimit, handleBooking);
