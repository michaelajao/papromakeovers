"use client";

import { eachDayOfInterval, endOfMonth, format, getDay, isSameDay, startOfMonth } from "date-fns";
import { useMemo } from "react";

type Props = {
  month: Date;
  selectedDate?: Date | null;
  onSelect: (date: Date) => void;
  availableDates?: string[]; // ISO date strings
};

export default function Calendar({ month, selectedDate, onSelect, availableDates = [] }: Props) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekOffset = (getDay(monthStart) + 6) % 7; // Monday start

  const availableSet = useMemo(() => new Set(availableDates.map((d) => d.slice(0, 10))), [availableDates]);

  return (
    <div className="bg-white text-[#4a4037] rounded p-4 border border-[#f5f2ed]">
      <div className="text-center font-bold mb-4 text-[#4a4037]">{format(month, "LLLL yyyy")}</div>
      <div className="grid grid-cols-7 gap-1">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="text-[#6b5d4f] font-semibold text-sm text-center">{d}</div>
        ))}
        {Array.from({ length: weekOffset }).map((_, i) => (
          <div key={`lead-${i}`} />
        ))}
        {days.map((d) => {
          const iso = d.toISOString().slice(0, 10);
          const isAvailable = availableSet.size === 0 || availableSet.has(iso);
          const selected = selectedDate && isSameDay(selectedDate, d);
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(d)}
              className={[
                "aspect-square grid place-items-center rounded transition",
                selected ? "bg-[#b49b82] text-white shadow-md" : "bg-[#f5f2ed] hover:bg-[#d4b896] hover:text-white",
                !isAvailable ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}


