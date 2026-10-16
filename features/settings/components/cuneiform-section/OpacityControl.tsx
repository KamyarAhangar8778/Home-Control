import React from "react";

interface OpacityControlProps {
  cuneiformOpacity: number;
  setCuneiformOpacity: (val: number) => void;
}

export default function OpacityControl({
  cuneiformOpacity,
  setCuneiformOpacity,
}: OpacityControlProps) {
  return (
    <div className="space-y-1.5 text-right w-full">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-accent3 font-mono" style={{ color: "var(--accent3)" }}>
          {Math.round(cuneiformOpacity * 100)}%
        </span>
        <label className="text-[10px] theme-text-secondary font-bold">
          میزان پدیداری (شفافیت):
        </label>
      </div>
      <input
        type="range"
        min="0.01"
        max="0.40"
        step="0.01"
        value={cuneiformOpacity}
        onChange={(e) => setCuneiformOpacity(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer"
        style={{ accentColor: "var(--accent3)" }}
      />
    </div>
  );
}
