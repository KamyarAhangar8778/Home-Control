import React from "react";
import { motion } from "motion/react";
import { heritagePresets, HeritagePreset } from "@/lib/presets";

interface HeritagePresetsListProps {
  accent3: string;
  accent4: string;
  onSelectPreset: (preset: HeritagePreset) => void;
}

export default function HeritagePresetsList({
  accent3,
  accent4,
  onSelectPreset,
}: HeritagePresetsListProps) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] theme-text-tertiary block font-bold">
        انتخاب پالت‌های تاریخی پادشاهی:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {heritagePresets.map((preset) => {
          const isSelected = accent3 === preset.accent3 && accent4 === preset.accent4;
          return (
            <motion.button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3.5 text-right transition-all text-xs theme-card-bg-solid border rounded-xl flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? "border-[var(--accent3)] bg-[var(--accent3-transparent)] shadow-[0_0_15px_var(--accent3-transparent)]"
                  : "border-[var(--border-color)] hover:border-[var(--accent3)]/60 bg-black/20 hover:bg-black/45"
              }`}
            >
              {/* Colors Preview dots - beautifully circular */}
              <div className="flex gap-2 items-center">
                <div
                  className="w-4 h-4 rounded-full border border-white/20 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                  style={{ backgroundColor: preset.accent4 }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/20 transition-transform duration-300 group-hover:scale-110 shadow-lg -mr-1.5"
                  style={{ backgroundColor: preset.accent3 }}
                />
              </div>
              <div className="text-right">
                <span className="font-extrabold theme-text-primary block">{preset.name}</span>
                <span className="text-[9.5px] theme-text-muted block mt-0.5">{preset.desc}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
