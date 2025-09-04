"use client";

import { useState, useEffect } from "react";
import TimePicker from "./TimePicker";

type TimeSlotManagerProps = {
  date: string;
  initialSlots?: string[];
  onChange: (date: string, slots: string[]) => void;
  onClose?: () => void;
};

type TimeRange = {
  start: string;
  end: string;
  duration: number; // in minutes
};

const PRESET_TEMPLATES = {
  "Full Day": { start: "06:00", end: "20:00", duration: 60 },
  "Morning Only": { start: "06:00", end: "12:00", duration: 60 },
  "Afternoon Only": { start: "12:00", end: "18:00", duration: 60 },
  "Evening Only": { start: "18:00", end: "20:00", duration: 60 },
  "Weekend Hours": { start: "10:00", end: "18:00", duration: 90 },
};

const BUSINESS_HOURS = {
  monday: { start: "06:00", end: "20:00" },
  tuesday: { start: "06:00", end: "20:00" },
  wednesday: { start: "06:00", end: "20:00" },
  thursday: { start: "06:00", end: "20:00" },
  friday: { start: "06:00", end: "20:00" },
  saturday: { start: "06:00", end: "20:00" },
  sunday: { start: "06:00", end: "20:00" },
};

export default function TimeSlotManager({ date, initialSlots = [], onChange, onClose }: TimeSlotManagerProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: "06:00",
    end: "20:00",
    duration: 60
  });
  const [customSlots, setCustomSlots] = useState<string[]>(initialSlots);
  const [mode, setMode] = useState<"range" | "custom">("range");

  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof BUSINESS_HOURS;
  const businessHours = BUSINESS_HOURS[dayOfWeek];

  useEffect(() => {
    if (initialSlots.length > 0) {
      setCustomSlots(initialSlots);
      setMode("custom");
    } else {
      // Set default based on day of week
      setTimeRange({
        start: businessHours.start,
        end: businessHours.end,
        duration: 60
      });
      setMode("range");
    }
  }, [date, initialSlots, businessHours.start, businessHours.end]);

  const generateSlotsFromRange = (start: string, end: string, duration: number): string[] => {
    const slots = [];
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    
    const currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const timeStr = currentTime.toTimeString().slice(0, 5);
      slots.push(timeStr);
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }
    
    return slots;
  };

  const applyPreset = (presetName: keyof typeof PRESET_TEMPLATES) => {
    const preset = PRESET_TEMPLATES[presetName];
    setTimeRange(preset);
    setMode("range");
  };

  const addCustomSlot = () => {
    const newSlot = "09:00";
    if (!customSlots.includes(newSlot)) {
      const newSlots = [...customSlots, newSlot].sort();
      setCustomSlots(newSlots);
    }
  };

  const removeCustomSlot = (slotToRemove: string) => {
    setCustomSlots(customSlots.filter(slot => slot !== slotToRemove));
  };

  const updateCustomSlot = (oldSlot: string, newSlot: string) => {
    const newSlots = customSlots.map(slot => slot === oldSlot ? newSlot : slot).sort();
    setCustomSlots(newSlots);
  };

  const handleSave = () => {
    const finalSlots = mode === "range" 
      ? generateSlotsFromRange(timeRange.start, timeRange.end, timeRange.duration)
      : customSlots;
    
    onChange(date, finalSlots);
    onClose?.();
  };

  const currentSlots = mode === "range" 
    ? generateSlotsFromRange(timeRange.start, timeRange.end, timeRange.duration)
    : customSlots;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#4a4037]">
              Manage Time Slots for {new Date(date).toLocaleDateString()}
            </h2>
            <button
              onClick={onClose}
              className="text-[#6b5d4f] hover:text-[#4a4037] text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode("range")}
                className={`px-4 py-2 rounded transition-colors ${
                  mode === "range" 
                    ? "bg-[#b49b82] text-white" 
                    : "bg-[#f5f2ed] text-[#4a4037] hover:bg-[#d4b896]"
                }`}
              >
                Time Range
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`px-4 py-2 rounded transition-colors ${
                  mode === "custom" 
                    ? "bg-[#b49b82] text-white" 
                    : "bg-[#f5f2ed] text-[#4a4037] hover:bg-[#d4b896]"
                }`}
              >
                Custom Slots
              </button>
            </div>
          </div>

          {mode === "range" && (
            <div className="space-y-6">
              {/* Preset Templates */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#6b5d4f]">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PRESET_TEMPLATES).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => applyPreset(preset as keyof typeof PRESET_TEMPLATES)}
                      className="px-3 py-1 text-sm rounded border border-[#d4b896] hover:bg-[#f5f2ed] transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TimePicker
                  label="Start Time"
                  value={timeRange.start}
                  onChange={(start) => setTimeRange({...timeRange, start})}
                  min={businessHours.start}
                  max={timeRange.end}
                />
                <TimePicker
                  label="End Time"
                  value={timeRange.end}
                  onChange={(end) => setTimeRange({...timeRange, end})}
                  min={timeRange.start}
                  max={businessHours.end}
                />
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#6b5d4f]">Slot Duration</label>
                  <select
                    value={timeRange.duration}
                    onChange={(e) => setTimeRange({...timeRange, duration: parseInt(e.target.value)})}
                    className="w-full border border-[#d4b896] rounded px-3 py-2 bg-white text-[#4a4037] focus:border-[#b49b82] focus:outline-none"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === "custom" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-[#4a4037]">Custom Time Slots</h3>
                <button
                  onClick={addCustomSlot}
                  className="px-3 py-1 bg-[#b49b82] text-white rounded hover:bg-[#9d8670] transition-colors"
                >
                  + Add Slot
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {customSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <TimePicker
                      label=""
                      value={slot}
                      onChange={(newSlot) => updateCustomSlot(slot, newSlot)}
                      min={businessHours.start}
                      max={businessHours.end}
                      className="flex-1"
                    />
                    <button
                      onClick={() => removeCustomSlot(slot)}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {customSlots.length === 0 && (
                  <p className="text-[#6b5d4f] text-center py-4">
                    No custom slots yet. Click &quot;Add Slot&quot; to get started.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="mt-6">
            <h3 className="font-medium text-[#4a4037] mb-2">Preview ({currentSlots.length} slots)</h3>
            <div className="flex flex-wrap gap-2 p-3 bg-[#f5f2ed] rounded border">
              {currentSlots.length === 0 ? (
                <span className="text-[#6b5d4f]">No slots available</span>
              ) : (
                currentSlots.map((slot) => (
                  <span
                    key={slot}
                    className="px-2 py-1 bg-white rounded text-sm border border-[#d4b896]"
                  >
                    {slot}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-[#f5f2ed]">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#d4b896] rounded text-[#4a4037] hover:bg-[#f5f2ed] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white rounded hover:shadow-lg transition-shadow"
            >
              Save Time Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}