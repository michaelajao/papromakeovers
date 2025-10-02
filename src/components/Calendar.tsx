"use client";

import { eachDayOfInterval, endOfMonth, format, getDay, isSameDay, startOfMonth } from "date-fns";
import { useMemo } from "react";

type Props = {
  month: Date;
  selectedDate?: Date | null;
  onSelect: (date: Date) => void;
  availableDates?: string[]; // ISO date strings
  onChangeMonth?: (direction: number) => void;
};

export default function Calendar({ month, selectedDate, onSelect, availableDates = [], onChangeMonth }: Props) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekOffset = (getDay(monthStart) + 6) % 7; // Monday start

  const availableSet = useMemo(() => new Set(availableDates.map((d) => d.slice(0, 10))), [availableDates]);

  return (
    <div className="bg-white text-[#4a4037] rounded p-4 border border-[#f5f2ed]">
      <div className="flex justify-between items-center mb-4">
        {onChangeMonth && (
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            className="p-2 hover:bg-[#f5f2ed] rounded-full transition-colors text-[#b49b82] hover:text-[#4a4037]"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="text-center font-bold text-[#4a4037] flex-1">{format(month, "LLLL yyyy")}</div>
        {onChangeMonth && (
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            className="p-2 hover:bg-[#f5f2ed] rounded-full transition-colors text-[#b49b82] hover:text-[#4a4037]"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
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


