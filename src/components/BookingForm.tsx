"use client";

import { useEffect, useMemo, useState } from "react";
import Calendar from "@/components/Calendar";

type AvailabilityResponse = {
  dates: string[]; // ISO date strings available
  slotsByDate: Record<string, string[]>; // date -> ["09:00", ...]
};

export default function BookingForm() {
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  // Month is derived in-effect; no local state to avoid lint warnings
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Preselect service from URL query (?service=slug)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const s = url.searchParams.get('service');
      if (s) setService(s);
    }
    const controller = new AbortController();
    async function loadAvailability() {
      try {
        const now = new Date();
        const params = new URLSearchParams({ month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}` });
        const res = await fetch(`/api/availability?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load availability");
        const data = (await res.json()) as AvailabilityResponse;
        setAvailability(data);
      } catch (e: unknown) {
        const isAbort = typeof e === "object" && e !== null && "name" in e && (e as { name?: string }).name === "AbortError";
        if (!isAbort) console.error(e);
      }
    }
    loadAvailability();
    return () => controller.abort();
  }, []);

  const timeSlots = useMemo(() => {
    if (!availability || !selectedDate) return [];
    const key = selectedDate.toISOString().slice(0, 10);
    return availability.slotsByDate[key] ?? [];
  }, [availability, selectedDate]);

  const month = useMemo(() => new Date(), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!service || !name || !email || !phone || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, name, email, phone, notes, date: selectedDate.toISOString().slice(0, 10), time: selectedTime }),
      });
      if (!res.ok) throw new Error("Failed to submit booking");
      alert("Thank you for your booking request! We'll contact you within 24 hours to confirm.");
      setService("");
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setSelectedDate(null);
      setSelectedTime("");
    } catch {
      alert("Sorry, something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="block font-semibold mb-2">Select Service</label>
        <select value={service} onChange={(e) => setService(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" required>
          <option value="">Choose a service...</option>
          <optgroup label="Services">
            <option value="studio-makeup">Studio makeup</option>
            <option value="party-guest-makeup">Party guest makeup</option>
            <option value="photoshoot-glam">Photoshoot glam</option>
            <option value="bridesmaids-bookings">Bridesmaids bookings</option>
            <option value="prom-glam">Graduation & Prom Glam</option>
            <option value="travel-makeup">Travel to client location makeup service</option>
            <option value="diy-makeup-class">DIY one on one makeup class</option>
            <option value="gele-tying">Gele tying</option>
          </optgroup>
          <optgroup label="Bridal services">
            <option value="bridal-civil">Civil wedding</option>
            <option value="bridal-traditional">Traditional wedding</option>
            <option value="bridal-white">White wedding</option>
            <option value="bridal-combination">Combination of all</option>
          </optgroup>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-2">Select Date</label>
        <Calendar
          month={month}
          onSelect={setSelectedDate}
          selectedDate={selectedDate}
          availableDates={availability?.dates}
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Available Time Slots</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timeSlots.length === 0 && (
            <div className="col-span-4 text-white/80">Select a date to see available times.</div>
          )}
          {timeSlots.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTime(t)}
              className={[
                "px-3 py-2 rounded bg-white text-[#4a4037] text-center hover:bg-[#d4b896] hover:text-white transition border border-[#f5f2ed]",
                selectedTime === t ? "!bg-[#b49b82] !text-white shadow-md" : "",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" required />
        </div>
        <div>
          <label className="block font-semibold mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" required />
        </div>
        <div>
          <label className="block font-semibold mb-2">Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" required />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-2">Special Requests (Optional)</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" placeholder="Any specific requirements or questions..."></textarea>
        </div>
      </div>

      <button disabled={submitting} className="rounded-full bg-white text-[#b49b82] font-semibold px-6 py-3 hover:translate-y-[-2px] transition shadow-lg hover:shadow-xl">
        {submitting ? "Submitting..." : "Confirm Booking"}
      </button>
    </form>
  );
}


