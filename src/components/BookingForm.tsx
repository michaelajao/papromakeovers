"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addMonths } from "date-fns";
import Calendar from "@/components/Calendar";
import { formatPriceFrom } from "@/lib/price";
import { toLocalDateString } from "@/lib/date";
import type { ServiceRow } from "@/types/service";

type AvailabilityResponse = {
  dates: string[];
  slotsByDate: Record<string, string[]>;
};

const CATEGORY_ORDER = ["Signature", "Group", "Bridal", "Education"];
const CATEGORY_LABELS: Record<string, string> = {
  Signature: "Signature Services",
  Group: "Group Services",
  Bridal: "Bridal Services",
  Education: "Education",
};

export default function BookingForm() {
  const [service, setService] = useState("");
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const s = url.searchParams.get("service");
      if (s) setService(s);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/services", { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as { services: ServiceRow[] };
        setServices(data.services ?? []);
      } catch {
        // ignore
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadAvailability() {
      try {
        const params = new URLSearchParams({
          month: `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`,
        });
        const res = await fetch(`/api/availability?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load availability");
        const data = (await res.json()) as AvailabilityResponse;
        setAvailability(data);
      } catch (e: unknown) {
        const isAbort =
          typeof e === "object" && e !== null && "name" in e && (e as { name?: string }).name === "AbortError";
        if (!isAbort) console.error(e);
      }
    }
    loadAvailability();
    return () => controller.abort();
  }, [currentMonth]);

  // Only clear selection when the currently-selected date falls outside the
  // new month. Flipping back and forth shouldn't wipe a committed choice.
  useEffect(() => {
    if (!selectedDate) return;
    const sameMonth =
      selectedDate.getFullYear() === currentMonth.getFullYear() &&
      selectedDate.getMonth() === currentMonth.getMonth();
    if (!sameMonth) {
      setSelectedDate(null);
      setSelectedTime("");
    }
  }, [currentMonth, selectedDate]);

  const dateLabel = useMemo(() => {
    if (!selectedDate) return "Choose a date";
    return selectedDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const timeSlots = useMemo(() => {
    if (!availability || !selectedDate) return [];
    const key = toLocalDateString(selectedDate);
    return availability.slotsByDate[key] ?? [];
  }, [availability, selectedDate]);

  const groupedServices = useMemo(() => {
    const byCat: Record<string, ServiceRow[]> = {};
    for (const s of services) {
      (byCat[s.category] ||= []).push(s);
    }
    const order = CATEGORY_ORDER.filter((c) => byCat[c]).concat(
      Object.keys(byCat).filter((c) => !CATEGORY_ORDER.includes(c)),
    );
    return order.map((cat) => ({ cat, items: byCat[cat] }));
  }, [services]);

  const selectedService = useMemo(
    () => services.find((s) => s.slug === service),
    [services, service],
  );

  const changeMonth = (direction: number) => {
    setCurrentMonth((prev) => addMonths(prev, direction));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!service || !name || !email || !phone || !selectedDate || !selectedTime) return;
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setFeedback(null);

    const dateKey = toLocalDateString(selectedDate);

    try {
      // Refetch services + availability to catch the case where the service was
      // deactivated or the slot was taken while this form was open.
      const [svcRes, availRes] = await Promise.all([
        fetch("/api/services"),
        fetch(
          `/api/availability?month=${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`,
        ),
      ]);
      if (svcRes.ok) {
        const svcData = (await svcRes.json()) as { services: ServiceRow[] };
        const stillActive = svcData.services.some((s) => s.slug === service);
        if (!stillActive) {
          setFeedback({ kind: "error", text: "That service is no longer available. Please pick another." });
          return;
        }
      }
      if (availRes.ok) {
        const availData = (await availRes.json()) as AvailabilityResponse;
        const currentSlots = availData.slotsByDate[dateKey] ?? [];
        if (!currentSlots.includes(selectedTime)) {
          setFeedback({ kind: "error", text: "That time has just been taken. Pick another slot — we refreshed the list." });
          setAvailability(availData);
          setSelectedTime("");
          return;
        }
      }

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          name,
          email,
          phone,
          notes,
          date: dateKey,
          time: selectedTime,
        }),
      });
      if (res.status === 409) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setFeedback({ kind: "error", text: body.error ?? "That time was just taken." });
        // Refresh availability so the user can pick another.
        if (availRes.ok) {
          const availData = (await availRes.json().catch(() => null)) as AvailabilityResponse | null;
          if (availData) setAvailability(availData);
        }
        setSelectedTime("");
        return;
      }
      if (!res.ok) throw new Error("Failed to submit booking");
      setFeedback({ kind: "success", text: "Thank you! Your booking request was received. We'll confirm within 24 hours." });
      setService("");
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setSelectedDate(null);
      setSelectedTime("");
    } catch {
      setFeedback({ kind: "error", text: "Sorry, something went wrong. Please try again." });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {feedback && (
        <div
          className={`px-4 py-3 rounded text-sm border ${
            feedback.kind === "success"
              ? "bg-[#faf8f5] text-[#3a322b] border-[#d4b896]"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
          role={feedback.kind === "error" ? "alert" : "status"}
        >
          {feedback.text}
        </div>
      )}

      <div>
        <label htmlFor="service" className="block font-semibold mb-2">Select Service</label>
        <select
          id="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none"
          required
        >
          <option value="">Choose a service...</option>
          {groupedServices.map(({ cat, items }) => (
            <optgroup key={cat} label={CATEGORY_LABELS[cat] ?? cat}>
              {items.map((s) => {
                const price = formatPriceFrom(s.price_from);
                return (
                  <option key={s.id} value={s.slug}>
                    {s.title}
                    {price ? ` — ${price.toLowerCase()}` : ""}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
        {selectedService?.price_from != null && (
          <p className="mt-2 text-sm text-[#5c5048]">
            <span className="font-serif text-lg text-[#7a2e3f] mr-1">{formatPriceFrom(selectedService.price_from).replace(/^From\s*/, "From ")}</span>
            · Final quote confirmed after booking.
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-2" id="date-label">Select Date</label>
        <button
          type="button"
          onClick={() => setDateOpen((v) => !v)}
          aria-expanded={dateOpen ? "true" : "false"}
          aria-controls="date-picker"
          aria-labelledby="date-label"
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded bg-white text-left text-[#4a4037] border border-[#f5f2ed] hover:border-[#d4b896] focus:border-[#d4b896] focus:outline-none transition"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#b49b82]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={selectedDate ? "font-medium" : "text-[#8b7355]"}>{dateLabel}</span>
          </span>
          <svg
            className={`w-4 h-4 text-[#8b7355] transition-transform ${dateOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dateOpen && (
          <div id="date-picker" className="mt-3 p-3 bg-white rounded border border-[#f5f2ed]">
            <Calendar
              month={currentMonth}
              onSelect={(d) => {
                setSelectedDate(d);
                setDateOpen(false);
              }}
              selectedDate={selectedDate}
              availableDates={availability?.dates}
              onChangeMonth={changeMonth}
              onGoToToday={() => setCurrentMonth(new Date())}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-2">Available Time Slots</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Available time slots">
          {timeSlots.length === 0 && (
            <div className="col-span-4 text-sm text-[#8b7355]">Select a date to see available times.</div>
          )}
          {timeSlots.map((t) => {
            const isSelected = selectedTime === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTime(t)}
                aria-pressed={isSelected ? "true" : "false"}
                className={[
                  "px-3 py-2 rounded text-center text-sm transition border",
                  isSelected
                    ? "bg-[#7a2e3f] text-white border-[#7a2e3f] shadow-md"
                    : "bg-white text-[#4a4037] border-[#e5ddd1] hover:border-[#7a2e3f] hover:text-[#7a2e3f]",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block font-semibold mb-2">Full Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" required />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold mb-2">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" required />
        </div>
        <div>
          <label htmlFor="phone" className="block font-semibold mb-2">Phone Number</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block font-semibold mb-2">Special Requests (Optional)</label>
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 rounded bg-white text-[#4a4037] border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none" placeholder="Any specific requirements or questions..."></textarea>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto rounded-full bg-[#7a2e3f] text-white font-semibold px-8 py-3.5 shadow-[0_10px_25px_rgba(122,46,63,0.35)] hover:bg-[#5c1f2c] hover:translate-y-[-2px] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Confirm Booking"}
      </button>
    </form>
  );
}
