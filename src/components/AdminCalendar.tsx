"use client";

import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth, addMonths, subMonths, isToday, isBefore } from "date-fns";
import { useMemo } from "react";

type AdminCalendarProps = {
  month: Date;
  selectedDates?: string[];
  slotsByDate?: Record<string, string[]>;
  onDateSelect: (date: string) => void;
  onMonthChange: (month: Date) => void;
  onDateEdit: (date: string) => void;
};

export default function AdminCalendar({ 
  month, 
  selectedDates = [], 
  slotsByDate = {}, 
  onDateSelect, 
  onMonthChange,
  onDateEdit 
}: AdminCalendarProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekOffset = (getDay(monthStart) + 6) % 7; // Monday start

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);
  
  const today = new Date();

  const goToPreviousMonth = () => {
    onMonthChange(subMonths(month, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(addMonths(month, 1));
  };

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const hasSlots = slotsByDate[dateStr] && slotsByDate[dateStr].length > 0;
    const isSelected = selectedSet.has(dateStr);
    const isPast = isBefore(date, today) && !isToday(date);

    if (isPast) {
      return 'past';
    } else if (hasSlots) {
      return slotsByDate[dateStr].length >= 6 ? 'full' : 'partial';
    } else if (isSelected) {
      return 'selected';
    }
    return 'available';
  };

  const getDateClasses = (date: Date) => {
    const status = getDateStatus(date);
    const todayDate = isToday(date);

    const baseClasses = "w-1/2 h-12 mx-auto flex items-center justify-center rounded-lg transition-all duration-200 relative text-sm font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1";
    
    switch (status) {
      case 'past':
        return `${baseClasses} bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200`;
      case 'full':
        return `${baseClasses} bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-pointer hover:bg-emerald-100 hover:border-emerald-300 focus:ring-emerald-500`;
      case 'partial':
        return `${baseClasses} bg-amber-50 text-amber-700 border-2 border-amber-200 cursor-pointer hover:bg-amber-100 hover:border-amber-300 focus:ring-amber-500`;
      case 'selected':
        return `${baseClasses} bg-[#b49b82] text-white border-2 border-[#9d8670] cursor-pointer hover:bg-[#9d8670] hover:border-[#8b7760] focus:ring-[#b49b82] shadow-md`;
      default:
        return `${baseClasses} bg-[#f9f7f4] text-[#4a4037] border border-[#e6ddd4] cursor-pointer hover:bg-[#b49b82] hover:text-white hover:border-[#9d8670] focus:ring-[#b49b82] ${
          todayDate ? 'ring-2 ring-[#b49b82] ring-opacity-60 ring-offset-2' : ''
        }`;
    }
  };

  const handleDateClick = (date: Date) => {
    const isPastDate = isBefore(date, today) && !isToday(date);
    if (isPastDate) return;
    
    const dateStr = date.toISOString().slice(0, 10);
    onDateSelect(dateStr);
  };

  const handleDateEdit = (date: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    const isPastDate = isBefore(date, today) && !isToday(date);
    if (isPastDate) return;
    
    const dateStr = date.toISOString().slice(0, 10);
    onDateEdit(dateStr);
  };

  return (
    <div className="bg-white rounded-lg border border-[#f5f2ed] shadow-sm">
      {/* Calendar Header */}
      <div className="p-4 border-b border-[#f5f2ed]">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded hover:bg-[#f5f2ed] transition-colors text-[#6b5d4f] hover:text-[#4a4037]"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold text-[#4a4037]">
            {format(month, "LLLL yyyy")}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded hover:bg-[#f5f2ed] transition-colors text-[#6b5d4f] hover:text-[#4a4037]"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-[#6b5d4f] py-3 bg-[#f9f7f4] rounded-md border border-[#e6ddd4]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Leading empty cells */}
          {Array.from({ length: weekOffset }).map((_, i) => (
            <div key={`lead-${i}`} className="h-12" />
          ))}

          {/* Calendar dates */}
          {days.map((date) => {
            const dateStr = date.toISOString().slice(0, 10);
            const slotCount = slotsByDate[dateStr]?.length || 0;
            const status = getDateStatus(date);

            return (
              <div key={date.toISOString()} className="relative group">
                <button
                  onClick={() => handleDateClick(date)}
                  className={getDateClasses(date)}
                  disabled={status === 'past'}
                >
                  {format(date, "d")}
                  
                  {/* Slot indicator */}
                  {slotCount > 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-[#b49b82] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md border-2 border-white font-bold">
                      {slotCount}
                    </div>
                  )}
                </button>

                {/* Edit button for dates with slots */}
                {slotCount > 0 && status !== 'past' && (
                  <button
                    onClick={(e) => handleDateEdit(date, e)}
                    className="absolute -top-1 -left-1 bg-[#d4b896] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#b49b82] transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md border-2 border-white hover:scale-110"
                    title="Edit time slots"
                  >
                    ✎
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-[#f5f2ed]">
          <div className="text-xs text-[#6b5d4f] mb-2 font-medium">Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"></div>
              <span className="text-[#6b5d4f] font-medium">Past</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#f9f7f4] border border-[#e6ddd4] rounded-md shadow-sm"></div>
              <span className="text-[#6b5d4f] font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-50 border-2 border-amber-200 rounded-md shadow-sm"></div>
              <span className="text-[#6b5d4f] font-medium">Partial slots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-200 rounded-md shadow-sm"></div>
              <span className="text-[#6b5d4f] font-medium">Full availability</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#b49b82] rounded-md shadow-sm"></div>
              <span className="text-[#6b5d4f] font-medium">Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}