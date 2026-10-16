import React from "react";
import { motion } from "motion/react";
import { CuneiformColor } from "./types";

interface ColorPickerProps {
  cuneiformColor: CuneiformColor;
  setCuneiformColor: (val: CuneiformColor) => void;
}

const COLOR_MODES = [
  { id: "accent3", name: "رنگ سوم (طلایی)", color: "var(--accent3)" },
  { id: "accent4", name: "رنگ چهارم (سبز)", color: "var(--accent4)" },
  { id: "white", name: "سفید شاهنشاهی", color: "#ffffff" },
  { id: "muted", name: "خاکستری کتبیه‌ای", color: "#718096" },
] as const;

export default function ColorPicker({ cuneiformColor, setCuneiformColor }: ColorPickerProps) {
  return (
    <div className="space-y-2 text-right w-full">
      <label className="text-[10px] theme-text-secondary font-bold block">
        رنگ نگاره‌های خط میخی:
      </label>
      <div className="grid grid-cols-2 gap-2">
        {COLOR_MODES.map((mode) => {
          const isSelected = cuneiformColor === mode.id;
          return (
            <motion.button
              key={mode.id}
              onClick={() => setCuneiformColor(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 text-right transition-all border text-[10px] rounded-xl flex items-center justify-between cursor-pointer ${
                isSelected
                  ? "border-[var(--accent3)] bg-[var(--accent3-transparent)] shadow-[0_0_12px_var(--accent3-transparent)] font-bold text-[var(--accent3)]"
                  : "border-[var(--border-color)] hover:border-[var(--accent3)]/50 bg-black/10 hover:bg-black/20"
              }`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-md transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: mode.color }}
              />
              <span
                className={isSelected ? "text-accent3" : "theme-text-secondary"}
                style={isSelected ? { color: "var(--accent3)" } : {}}
              >
                {mode.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
