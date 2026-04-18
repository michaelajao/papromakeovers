"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useMemo } from "react";
import { toLocalDateString } from "@/lib/date";

type AdminCalendarProps = {
  month: Date;
  selectedDates?: string[];
  slotsByDate?: Record<string, string[]>;
  onDateSelect: (date: string) => void;
  onMonthChange: (month: Date) => void;
  onDateEdit: (date: string) => void;
};

const DAYS_IN_WEEK = 7;

export default function AdminCalendar({
  month,
  selectedDates = [],
  slotsByDate = {},
  onDateSelect,
  onMonthChange,
  onDateEdit,
}: AdminCalendarProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekOffset = (getDay(monthStart) + 6) % 7;

  const leadingDays = Array.from({ length: weekOffset }, (_, i) =>
    addDays(monthStart, -weekOffset + i),
  );
  const totalCells = Math.ceil((leadingDays.length + monthDays.length) / DAYS_IN_WEEK) * DAYS_IN_WEEK;
  const trailingCount = totalCells - leadingDays.length - monthDays.length;
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => addDays(monthEnd, i + 1));
  const allCells = [...leadingDays, ...monthDays, ...trailingDays];

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);
  const today = new Date();

  const goToPreviousMonth = () => onMonthChange(subMonths(month, 1));
  const goToNextMonth = () => onMonthChange(addMonths(month, 1));
  const goToToday = () => onMonthChange(new Date());

  const getStatus = (date: Date) => {
    const dateStr = toLocalDateString(date);
    const slotCount = slotsByDate[dateStr]?.length ?? 0;
    const isSelected = selectedSet.has(dateStr);
    const isPast = isBefore(date, today) && !isToday(date);
    if (isPast) return "past" as const;
    if (slotCount > 0) return slotCount >= 6 ? "full" : "partial";
    if (isSelected) return "selected" as const;
    return "available" as const;
  };

  const getClasses = (date: Date, inMonth: boolean) => {
    const status = getStatus(date);
    const todayRing = isToday(date) ? "ring-2 ring-[#7a2e3f]/70 ring-offset-2" : "";
    const base =
      "w-full h-12 flex items-center justify-center rounded-lg transition-all duration-200 relative text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7a2e3f]";

    if (!inMonth) {
      return `${base} text-[#c7b9a8] cursor-default`;
    }
    switch (status) {
      case "past":
        return `${base} bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200`;
      case "full":
        return `${base} bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-pointer hover:bg-emerald-100 ${todayRing}`;
      case "partial":
        return `${base} bg-amber-50 text-amber-700 border-2 border-amber-200 cursor-pointer hover:bg-amber-100 ${todayRing}`;
      case "selected":
        return `${base} bg-[#7a2e3f] text-white border-2 border-[#5c1f2c] cursor-pointer hover:bg-[#5c1f2c] ${todayRing}`;
      default:
        return `${base} bg-[#f9f7f4] text-[#4a4037] border border-[#e6ddd4] cursor-pointer hover:bg-[#7a2e3f] hover:text-white hover:border-[#5c1f2c] ${todayRing}`;
    }
  };

  const handleClick = (date: Date) => {
    if (isBefore(date, today) && !isToday(date)) return;
    if (!isSameMonth(date, month)) return;
    onDateSelect(toLocalDateString(date));
  };

  const handleEdit = (date: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isBefore(date, today) && !isToday(date)) return;
    onDateEdit(toLocalDateString(date));
  };

  return (
    <div className="bg-white rounded-lg border border-[#f5f2ed] shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-[#f5f2ed]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
            className="p-2 rounded-full hover:bg-[#faf8f5] text-[#7a2e3f] hover:text-[#5c1f2c] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="flex-1 text-center font-serif text-xl text-[#3a322b]">
            {format(month, "LLLL yyyy")}
          </h3>
          {!isSameMonth(month, today) && (
            <button
              type="button"
              onClick={goToToday}
              className="text-xs font-medium text-[#7a2e3f] hover:text-[#5c1f2c] px-2 py-1 rounded transition-colors"
            >
              Today
            </button>
          )}
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="p-2 rounded-full hover:bg-[#faf8f5] text-[#7a2e3f] hover:text-[#5c1f2c] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center text-[11px] font-semibold text-[#8b7355] tracking-widest uppercase py-3">
              {day}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-7 gap-2"
          onKeyDown={(e) => {
            const map: Record<string, number> = {
              ArrowLeft: -1,
              ArrowRight: 1,
              ArrowUp: -7,
              ArrowDown: 7,
            };
            const delta = map[e.key];
            if (!delta) return;
            const target = e.target as HTMLElement;
            const iso = target.getAttribute("data-iso");
            if (!iso) return;
            e.preventDefault();
            const [y, m, d] = iso.split("-").map(Number);
            const next = addDays(new Date(y, m - 1, d), delta);
            const nextIso = toLocalDateString(next);
            const btn = e.currentTarget.querySelector<HTMLButtonElement>(`button[data-iso="${nextIso}"]`);
            btn?.focus();
          }}
        >
          {allCells.map((date) => {
            const inMonth = isSameMonth(date, month);
            const dateStr = toLocalDateString(date);
            const slotCount = slotsByDate[dateStr]?.length ?? 0;
            const status = getStatus(date);
            const clickable = inMonth && status !== "past";
            const selected = inMonth && selectedSet.has(dateStr);

            return (
              <div key={dateStr} className="relative">
                <button
                  type="button"
                  data-iso={dateStr}
                  disabled={!clickable}
                  tabIndex={clickable ? 0 : -1}
                  onClick={() => handleClick(date)}
                  aria-pressed={selected ? "true" : "false"}
                  aria-label={format(date, "EEEE, d MMMM yyyy")}
                  className={getClasses(date, inMonth)}
                >
                  {format(date, "d")}
                  {slotCount > 0 && inMonth && (
                    <span className="absolute -bottom-1 -right-1 bg-[#7a2e3f] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-md border-2 border-white font-bold">
                      {slotCount}
                    </span>
                  )}
                </button>

                {/* Edit time-slots button — always visible when slots exist
                    (previously hover-only, hid itself on mobile entirely). */}
                {slotCount > 0 && status !== "past" && inMonth && (
                  <button
                    type="button"
                    onClick={(e) => handleEdit(date, e)}
                    aria-label={`Edit time slots for ${format(date, "d MMMM yyyy")}`}
                    title="Edit time slots"
                    className="absolute -top-1 -left-1 bg-[#d4b896] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#7a2e3f] transition-all duration-200 shadow-md border-2 border-white hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#7a2e3f]"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-[#f5f2ed]">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded-md"></div>
              <span className="text-[#6b5d4f]">Past</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#f9f7f4] border border-[#e6ddd4] rounded-md"></div>
              <span className="text-[#6b5d4f]">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-50 border-2 border-amber-200 rounded-md"></div>
              <span className="text-[#6b5d4f]">Partial slots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-200 rounded-md"></div>
              <span className="text-[#6b5d4f]">Full availability</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#7a2e3f] rounded-md"></div>
              <span className="text-[#6b5d4f]">Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
