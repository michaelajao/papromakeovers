"use client";

import { useState, useEffect } from "react";

type TimePickerProps = {
  label: string;
  value: string;
  onChange: (time: string) => void;
  min?: string;
  max?: string;
  className?: string;
};

export default function TimePicker({ label, value, onChange, min, max, className = "" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value ? parseInt(value.split(':')[0]) : 9);
  const [minutes, setMinutes] = useState(value ? parseInt(value.split(':')[1]) : 0);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleTimeSelect = (newHours: number, newMinutes: number) => {
    const timeString = formatTime(newHours, newMinutes);
    
    // Check min/max bounds
    if (min && timeString < min) return;
    if (max && timeString > max) return;
    
    setHours(newHours);
    setMinutes(newMinutes);
    onChange(timeString);
    setIsOpen(false);
  };

  const generateTimeOptions = () => {
    const options = [];
    const minTime = min ? min.split(':').map(Number) : [6, 0];
    const maxTime = max ? max.split(':').map(Number) : [23, 30];
    
    for (let h = minTime[0]; h <= maxTime[0]; h++) {
      const startMinute = h === minTime[0] ? minTime[1] : 0;
      const endMinute = h === maxTime[0] ? maxTime[1] : 59;
      
      for (let m = startMinute; m <= endMinute; m += 30) {
        if (m === 60) continue; // Skip invalid minutes
        options.push({ hours: h, minutes: m });
      }
    }
    
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium mb-2 text-[#6b5d4f]">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full border border-[#d4b896] rounded px-3 py-2 bg-white text-[#4a4037] focus:border-[#b49b82] focus:outline-none text-left flex justify-between items-center"
        >
          <span>{formatTime(hours, minutes)}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#d4b896] rounded shadow-lg max-h-48 overflow-y-auto">
            {timeOptions.map(({ hours: h, minutes: m }) => {
              const timeStr = formatTime(h, m);
              const isSelected = h === hours && m === minutes;
              
              return (
                <button
                  key={timeStr}
                  type="button"
                  onClick={() => handleTimeSelect(h, m)}
                  className={`w-full px-3 py-2 text-left hover:bg-[#f5f2ed] transition-colors ${
                    isSelected ? 'bg-[#b49b82] text-white' : 'text-[#4a4037]'
                  }`}
                >
                  {timeStr}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}