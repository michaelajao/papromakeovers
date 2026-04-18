"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { useMemo } from "react";
import { toLocalDateString } from "@/lib/date";

type Props = {
  month: Date;
  selectedDate?: Date | null;
  onSelect: (date: Date) => void;
  availableDates?: string[];
  onChangeMonth?: (direction: number) => void;
  onGoToToday?: () => void;
};

const DAYS_IN_WEEK = 7;

export default function Calendar({
  month,
  selectedDate,
  onSelect,
  availableDates = [],
  onChangeMonth,
  onGoToToday,
}: Props) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekOffset = (getDay(monthStart) + 6) % 7; // Monday-first

  // Fill leading cells with prior-month tail so the grid is never blank.
  const leadingDays = Array.from({ length: weekOffset }, (_, i) =>
    addDays(monthStart, -weekOffset + i),
  );
  // Trailing cells to complete the final week of the grid.
  const totalCells = Math.ceil((leadingDays.length + monthDays.length) / DAYS_IN_WEEK) * DAYS_IN_WEEK;
  const trailingCount = totalCells - leadingDays.length - monthDays.length;
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => addDays(monthEnd, i + 1));

  const allCells = [...leadingDays, ...monthDays, ...trailingDays];
  const availableSet = useMemo(
    () => new Set(availableDates.map((d) => d.slice(0, 10))),
    [availableDates],
  );
  const today = new Date();
  const todayIso = toLocalDateString(today);

  // Move DOM focus to the neighbour day without committing selection.
  function focusSibling(fromDate: Date, delta: number, container: HTMLElement | null) {
    if (!container) return;
    const target = addDays(fromDate, delta);
    const iso = toLocalDateString(target);
    const btn = container.querySelector<HTMLButtonElement>(`button[data-iso="${iso}"]`);
    if (btn && !btn.disabled) btn.focus();
  }

  return (
    <div className="bg-white text-[#4a4037] rounded p-4 border border-[#f5f2ed]">
      <div className="flex items-center gap-2 mb-4">
        {onChangeMonth && (
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            className="p-2 hover:bg-[#faf8f5] rounded-full transition-colors text-[#7a2e3f] hover:text-[#5c1f2c]"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex-1 text-center font-serif text-lg text-[#3a322b]">
          {format(month, "LLLL yyyy")}
        </div>
        {onGoToToday && !isSameMonth(month, today) && (
          <button
            type="button"
            onClick={onGoToToday}
            className="text-xs font-medium text-[#7a2e3f] hover:text-[#5c1f2c] px-2 py-1 rounded transition-colors"
          >
            Today
          </button>
        )}
        {onChangeMonth && (
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            className="p-2 hover:bg-[#faf8f5] rounded-full transition-colors text-[#7a2e3f] hover:text-[#5c1f2c]"
            aria-label="Next month"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <div
        className="grid grid-cols-7 gap-1"
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
          focusSibling(new Date(y, m - 1, d), delta, e.currentTarget);
        }}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-[#8b7355] font-medium text-xs text-center tracking-wider uppercase py-2">
            {d}
          </div>
        ))}

        {allCells.map((d) => {
          const iso = toLocalDateString(d);
          const inMonth = isSameMonth(d, month);
          const isAvailable = inMonth && (availableSet.size === 0 || availableSet.has(iso));
          const selected = selectedDate && isSameDay(selectedDate, d);
          const isToday = iso === todayIso;

          return (
            <button
              key={iso}
              type="button"
              data-iso={iso}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(d)}
              aria-pressed={selected ? "true" : "false"}
              aria-label={format(d, "EEEE, d MMMM yyyy")}
              tabIndex={isAvailable ? 0 : -1}
              className={[
                "aspect-square grid place-items-center rounded transition text-sm relative",
                selected
                  ? "bg-[#7a2e3f] text-white shadow-md font-semibold"
                  : !inMonth
                    ? "text-[#c7b9a8] cursor-default"
                    : isAvailable
                      ? "bg-[#f5f2ed] text-[#4a4037] hover:bg-[#7a2e3f] hover:text-white cursor-pointer"
                      : "bg-[#f5f2ed] text-[#b5a999] cursor-not-allowed",
                isToday && !selected ? "ring-2 ring-[#7a2e3f]/60 ring-offset-1" : "",
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
