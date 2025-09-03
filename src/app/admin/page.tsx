"use client";

import { useEffect, useState } from "react";
import AdminCalendar from "@/components/AdminCalendar";
import TimeSlotManager from "@/components/TimeSlotManager";

type Payload = { month: string; dates: string[]; slotsByDate: Record<string, string[]> };

export default function AdminPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [dates, setDates] = useState<string[]>([]);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const monthStr = currentMonth.toISOString().slice(0, 7);
    setMonth(monthStr);
  }, [currentMonth]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/availability?month=${month}`);
      if (res.ok) {
        const data = (await res.json()) as Payload;
        setDates(data.dates);
        setSlotsByDate(data.slotsByDate);
        setHasUnsavedChanges(false);
      }
    })();
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
    } else {
      // Add date with default slots
      setDates((prev) => [...prev, dateStr]);
      setSlotsByDate((prev) => ({ 
        ...prev, 
        [dateStr]: ["09:00","11:00","13:00","15:00","17:00","19:00"] 
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
        headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
        body: JSON.stringify({ month, dates, slotsByDate }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Availability saved");
      setHasUnsavedChanges(false);
    } catch {
      alert("Failed to save availability");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#4a4037]">
      <div className="max-w-[1400px] mx-auto px-5 py-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#4a4037] mb-2">Admin: Manage Availability</h1>
            <p className="text-[#6b5d4f]">Click dates to toggle availability, or click the edit icon to customize time slots</p>
          </div>
          
          {hasUnsavedChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-sm text-yellow-800">
              ⚠️ You have unsaved changes
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="grid sm:grid-cols-2 gap-4 items-end mb-8">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#6b5d4f]">Admin Passcode</label>
            <input 
              type="password"
              value={passcode} 
              onChange={(e) => setPasscode(e.target.value)} 
              className="w-full border border-[#d4b896] rounded px-3 py-2 bg-white text-[#4a4037] focus:border-[#b49b82] focus:outline-none" 
              placeholder="Enter passcode" 
            />
          </div>
          <div>
            <button 
              disabled={saving || !passcode} 
              onClick={save} 
              className={`w-full rounded px-4 py-2 shadow-lg transition-all ${
                saving || !passcode
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white hover:shadow-xl"
              } ${hasUnsavedChanges ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
            >
              {saving ? "Saving..." : "Save Availability"}
            </button>
          </div>
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

            {/* Active Dates List */}
            {dates.length > 0 && (
              <div className="bg-white rounded-lg border border-[#f5f2ed] p-4">
                <h3 className="font-semibold text-[#4a4037] mb-3">Active Dates</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dates.sort().map((d) => (
                    <div key={d} className="flex items-center justify-between text-sm">
                      <span className="text-[#4a4037]">
                        {new Date(d).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#6b5d4f]">
                          {slotsByDate[d]?.length || 0} slots
                        </span>
                        <button
                          onClick={() => setEditingDate(d)}
                          className="px-2 py-1 text-xs bg-[#f5f2ed] hover:bg-[#d4b896] hover:text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-[#f5f2ed] p-4">
              <h3 className="font-semibold text-[#4a4037] mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    const newDates = [];
                    const newSlots: Record<string, string[]> = {};
                    
                    for (let d = new Date(today); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
                      const dayOfWeek = d.getDay();
                      if (dayOfWeek !== 0) { // Skip Sundays
                        const dateStr = d.toISOString().slice(0, 10);
                        newDates.push(dateStr);
                        newSlots[dateStr] = ["09:00","11:00","13:00","15:00","17:00","19:00"];
                      }
                    }
                    
                    setDates(newDates);
                    setSlotsByDate({...slotsByDate, ...newSlots});
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-[#f5f2ed] hover:bg-[#d4b896] hover:text-white rounded transition-colors"
                >
                  Fill Rest of Month (Mon-Sat)
                </button>
                <button
                  onClick={() => {
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
            date={editingDate}
            initialSlots={slotsByDate[editingDate] || []}
            onChange={handleSlotUpdate}
            onClose={() => setEditingDate(null)}
          />
        )}
      </div>
    </div>
  );
}


