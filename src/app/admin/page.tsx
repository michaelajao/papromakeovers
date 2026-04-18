"use client";

import { useEffect, useRef, useState } from "react";
import AdminCalendar from "@/components/AdminCalendar";
import TimeSlotManager from "@/components/TimeSlotManager";
import ServicesManager from "@/components/admin/ServicesManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { createClient } from "@/utils/supabase/client";
import { toLocalDateString, toLocalMonthString } from "@/lib/date";

type AdminTab = "availability" | "services" | "reviews";

type Payload = { month: string; dates: string[]; slotsByDate: Record<string, string[]> };

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("availability");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [month, setMonth] = useState<string>(toLocalMonthString(new Date()));
  const [dates, setDates] = useState<string[]>([]);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  type AdminBooking = { id: number; name: string; service: string; date: string; time: string; status: string };
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [banner, setBanner] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  function showBanner(kind: "success" | "error", text: string, autoDismiss = true) {
    setBanner({ kind, text });
    if (autoDismiss) {
      window.setTimeout(() => setBanner(null), 4000);
    }
  }

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? "");
    })();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  useEffect(() => {
    setMonth(toLocalMonthString(currentMonth));
  }, [currentMonth]);

  // Warn the user before closing the tab with unsaved availability changes.
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  function handleTabChange(next: AdminTab) {
    if (next === tab) return;
    if (tab === "availability" && hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved availability changes. Discard them and switch tabs?",
      );
      if (!confirmed) return;
      // Reload from server to drop the in-memory edits.
      setHasUnsavedChanges(false);
    }
    setTab(next);
  }

  // Ref mirrors hasUnsavedChanges so async handlers can read current value
  // without capturing a stale closure.
  const unsavedRef = useRef(false);
  useEffect(() => { unsavedRef.current = hasUnsavedChanges; }, [hasUnsavedChanges]);

  useEffect(() => {
    const controller = new AbortController();
    const reqMonth = month;
    (async () => {
      try {
        const res = await fetch(`/api/availability?month=${reqMonth}`, { signal: controller.signal });
        if (res.ok && !unsavedRef.current) {
          const data = (await res.json()) as Payload;
          setDates(data.dates);
          setSlotsByDate(data.slotsByDate);
        }
      } catch (err: unknown) {
        const isAbort =
          typeof err === "object" && err !== null && "name" in err && (err as { name?: string }).name === "AbortError";
        if (!isAbort) console.error(err);
      }

      try {
        const br = await fetch(`/api/bookings?month=${reqMonth}`, { signal: controller.signal });
        if (br.ok) {
          const bj = (await br.json()) as { bookings: AdminBooking[] };
          setBookings(bj.bookings);
        } else {
          setBookings([]);
        }
      } catch {
        // AbortError — harmless, leave state alone.
      }
    })();
    return () => controller.abort();
  }, [month]);

  function handleDateSelect(dateStr: string) {
    const isCurrentlySelected = dates.includes(dateStr);
    
    if (isCurrentlySelected) {
      // Remove date
      setDates((prev) => prev.filter((x) => x !== dateStr));
      setSlotsByDate((prev) => {
        const newSlots = { ...prev };
        delete newSlots[dateStr];
        return newSlots;
      });
      // Close edit panel if we're removing the date being edited
      if (editingDate === dateStr) {
        setEditingDate(null);
      }
    } else {
      // Add date with default slots
      setDates((prev) => [...prev, dateStr]);
      setSlotsByDate((prev) => ({ 
        ...prev, 
        [dateStr]: ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"] 
      }));
    }
    setHasUnsavedChanges(true);
  }

  function handleSlotUpdate(dateStr: string, slots: string[]) {
    if (slots.length === 0) {
      // Remove date if no slots
      setDates((prev) => prev.filter((x) => x !== dateStr));
      setSlotsByDate((prev) => {
        const newSlots = { ...prev };
        delete newSlots[dateStr];
        return newSlots;
      });
    } else {
      // Update slots
      if (!dates.includes(dateStr)) {
        setDates((prev) => [...prev, dateStr]);
      }
      setSlotsByDate((prev) => ({ ...prev, [dateStr]: slots }));
    }
    setHasUnsavedChanges(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, dates, slotsByDate }),
      });
      if (!res.ok) throw new Error("Save failed");
      showBanner("success", "Availability saved");
      setHasUnsavedChanges(false);
    } catch {
      showBanner("error", "Failed to save availability. Please try again.", false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#4a4037]">
      <div className="max-w-[1400px] mx-auto px-5 py-10">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#4a4037] mb-2">Admin Dashboard</h1>
            <p className="text-[#6b5d4f]">
              {tab === "availability"
                ? "Click dates to toggle availability, or click the edit icon to customize time slots"
                : "Manage the services shown on the website and in the booking form."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {tab === "availability" && hasUnsavedChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-sm text-yellow-800">
                ⚠️ You have unsaved changes
              </div>
            )}
            <div className="text-right">
              {userEmail && (
                <div className="text-xs text-[#6b5d4f]">Signed in as</div>
              )}
              <div className="flex items-center gap-3 flex-wrap justify-end">
                {userEmail && (
                  <span className="text-sm font-medium text-[#4a4037]">{userEmail}</span>
                )}
                <a
                  href="/admin/update-password"
                  className="text-sm px-3 py-1.5 rounded border border-[#d4b896] text-[#8b7355] hover:bg-[#faf8f5] transition-colors"
                >
                  Change password
                </a>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-sm px-3 py-1.5 rounded border border-[#d4b896] text-[#8b7355] hover:bg-[#faf8f5] transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {banner && (
          <div
            className={`mb-6 px-4 py-3 rounded border text-sm flex items-start justify-between gap-4 ${
              banner.kind === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
            role={banner.kind === "error" ? "alert" : "status"}
          >
            <span>{banner.text}</span>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="text-xs opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 border-b border-[#e5ddd1] mb-8">
          {([
            { id: "availability", label: "Availability & Bookings" },
            { id: "services", label: "Services & Pricing" },
            { id: "reviews", label: "Reviews" },
          ] as { id: AdminTab; label: string }[]).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? "border-[#7a2e3f] text-[#3a322b]"
                  : "border-transparent text-[#6b5d4f] hover:text-[#3a322b]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "services" && <ServicesManager />}

        {tab === "reviews" && <TestimonialsManager />}

        {tab === "availability" && (
        <>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center justify-between sm:justify-start">
            <div className="text-sm text-[#6b5d4f]">
              {hasUnsavedChanges && (
                <span className="text-orange-600 font-medium">• Unsaved changes</span>
              )}
              {!hasUnsavedChanges && (
                <span className="text-green-600 font-medium">• All changes saved</span>
              )}
            </div>
            {/* Mobile save button */}
            <button
              type="button"
              disabled={saving || !hasUnsavedChanges}
              onClick={save}
              className={`sm:hidden rounded px-4 py-2 text-sm shadow-lg transition-all ${
                saving || !hasUnsavedChanges
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white hover:shadow-xl"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          {/* Desktop save button */}
          <button
            type="button"
            disabled={saving || !hasUnsavedChanges}
            onClick={save}
            className={`hidden sm:block rounded px-6 py-2 shadow-lg transition-all ${
              saving || !hasUnsavedChanges
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white hover:shadow-xl"
            }`}
          >
            {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>

        {/* Enhanced Calendar */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AdminCalendar
              month={currentMonth}
              selectedDates={dates}
              slotsByDate={slotsByDate}
              onDateSelect={handleDateSelect}
              onMonthChange={setCurrentMonth}
              onDateEdit={setEditingDate}
            />
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-lg border border-[#f5f2ed] p-4">
              <h3 className="font-semibold text-[#4a4037] mb-3">Month Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b5d4f]">Available Days:</span>
                  <span className="font-medium">{dates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5d4f]">Total Slots:</span>
                  <span className="font-medium">
                    {Object.values(slotsByDate).reduce((acc, slots) => acc + slots.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5d4f]">Average per Day:</span>
                  <span className="font-medium">
                    {dates.length > 0 
                      ? Math.round(Object.values(slotsByDate).reduce((acc, slots) => acc + slots.length, 0) / dates.length)
                      : 0}
                  </span>
                </div>
              </div>
            </div>


            {/* Bookings Management */}
            <div className="bg-white rounded-lg border border-[#f5f2ed] p-4">
              <h3 className="font-semibold text-[#4a4037] mb-3">Bookings (this month)</h3>
              {bookings.length === 0 ? (
                <p className="text-sm text-[#6b5d4f]">No bookings yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm">
                      <div className="text-[#4a4037]">
                        <span className="font-medium">{b.name}</span> · {b.service} · {b.date} {b.time}
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{b.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const r = await fetch('/api/bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, action: 'accept' }) });
                            if (!r.ok) { showBanner("error", "Failed to accept booking."); return; }
                            const br = await fetch(`/api/bookings?month=${month}`);
                            if (br.ok) { const bj = await br.json(); setBookings(bj.bookings); }
                            showBanner("success", "Booking accepted and slot blocked.");
                          }}
                          className="px-2 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded"
                        >
                          Accept & Block Slot
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const r = await fetch('/api/bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, action: 'cancel' }) });
                            if (!r.ok) { showBanner("error", "Failed to cancel booking."); return; }
                            const br = await fetch(`/api/bookings?month=${month}`);
                            if (br.ok) { const bj = await br.json(); setBookings(bj.bookings); }
                            showBanner("success", "Booking cancelled and slot reopened.");
                          }}
                          className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded"
                        >
                          Cancel & Reopen Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-[#f5f2ed] p-4">
              <h3 className="font-semibold text-[#4a4037] mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const DEFAULT_SLOTS = [
                      "06:00","07:00","08:00","09:00","10:00","11:00","12:00",
                      "13:00","14:00","15:00","16:00","17:00","18:00","19:00",
                    ];
                    // Operate on the currently viewed month, not today's month.
                    const year = currentMonth.getFullYear();
                    const monthIdx = currentMonth.getMonth();
                    const lastDay = new Date(year, monthIdx + 1, 0).getDate();
                    const today = new Date();
                    const todayKey = toLocalDateString(today);
                    // Start from the 1st of the viewed month unless it's the current
                    // month — then start from today so we don't mark past dates.
                    const startDay =
                      year === today.getFullYear() && monthIdx === today.getMonth()
                        ? today.getDate()
                        : 1;

                    const mergedDates = new Set(dates);
                    const mergedSlots = { ...slotsByDate };
                    let added = 0;
                    for (let day = startDay; day <= lastDay; day++) {
                      const d = new Date(year, monthIdx, day);
                      const key = toLocalDateString(d);
                      if (key < todayKey) continue;
                      if (!mergedDates.has(key)) {
                        mergedDates.add(key);
                        mergedSlots[key] = DEFAULT_SLOTS;
                        added++;
                      }
                      // If date already has custom slots, leave them untouched.
                    }
                    setDates(Array.from(mergedDates).sort());
                    setSlotsByDate(mergedSlots);
                    setHasUnsavedChanges(true);
                    showBanner(
                      "success",
                      added === 0
                        ? "Every remaining date this month is already filled."
                        : `Filled ${added} date${added === 1 ? "" : "s"}. Click Save to apply.`,
                    );
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-[#f5f2ed] hover:bg-[#d4b896] hover:text-white rounded transition-colors"
                >
                  Fill this month (all days)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (dates.length === 0) return;
                    const confirmed = window.confirm(
                      `Clear all ${dates.length} selected date${dates.length === 1 ? "" : "s"} in this month? You'll still need to click Save for this to take effect.`,
                    );
                    if (!confirmed) return;
                    setDates([]);
                    setSlotsByDate({});
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors"
                >
                  Clear All Dates
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slot Manager Modal */}
        {editingDate && (
          <TimeSlotManager
            key={editingDate} // Force re-render when date changes
            date={editingDate}
            initialSlots={slotsByDate[editingDate] || []}
            onChange={handleSlotUpdate}
            onClose={() => setEditingDate(null)}
          />
        )}
        </>
        )}
      </div>
    </div>
  );
}


