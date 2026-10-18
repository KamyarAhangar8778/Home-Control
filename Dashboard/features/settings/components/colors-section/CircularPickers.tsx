import React from "react";

interface CircularPickersProps {
  accent3: string;
  setAccent3: (val: string) => void;
  accent4: string;
  setAccent4: (val: string) => void;
}

export default function CircularPickers({
  accent3,
  setAccent3,
  accent4,
  setAccent4,
}: CircularPickersProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Accent 3 Manual Circular Picker */}
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border-color)] bg-black/15 hover:bg-black/30 transition-colors">
        <span className="text-[10px] theme-text-secondary font-bold mb-3">رنگ سوم اصلی</span>
        <div
          className="relative w-12 h-12 rounded-full border-2 border-white/30 shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-110 cursor-pointer"
          style={{ backgroundColor: accent3 }}
        >
          <input
            type="color"
            value={accent3}
            onChange={(e) => setAccent3(e.target.value)}
            className="absolute inset-0 w-16 h-16 -m-2 opacity-0 cursor-pointer"
          />
          <div
            className="w-5 h-5 rounded-full border border-white/50 pointer-events-none"
            style={{ backgroundColor: accent3 }}
          />
        </div>
      </div>

      {/* Accent 4 Manual Circular Picker */}
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border-color)] bg-black/15 hover:bg-black/30 transition-colors">
        <span className="text-[10px] theme-text-secondary font-bold mb-3">رنگ چهارم کمکی</span>
        <div
          className="relative w-12 h-12 rounded-full border-2 border-white/30 shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-110 cursor-pointer"
          style={{ backgroundColor: accent4 }}
        >
          <input
            type="color"
            value={accent4}
            onChange={(e) => setAccent4(e.target.value)}
            className="absolute inset-0 w-16 h-16 -m-2 opacity-0 cursor-pointer"
          />
          <div
            className="w-5 h-5 rounded-full border border-white/50 pointer-events-none"
            style={{ backgroundColor: accent4 }}
          />
        </div>
      </div>
    </div>
  );
}
