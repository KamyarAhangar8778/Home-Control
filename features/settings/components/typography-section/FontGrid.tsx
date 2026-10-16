"use client";

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { FONTS_LIST } from "./constants";

interface FontGridProps {
  selectedFont: string;
  setSelectedFont: (val: string) => void;
}

export default function FontGrid({ selectedFont, setSelectedFont }: FontGridProps) {
  return (
    <div className="space-y-4 text-right">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        یکی از قلم‌های زیر را برای بورد خود انتخاب نمایید. پیش‌نمایش زنده هر قلم با متن زیر نمایش داده
        شده است:
      </p>

      {/* Grid: 2 rows of 5 columns on large screen, wrapping nicely on smaller screens */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 pt-1">
        {FONTS_LIST.map((font) => {
          const isSelected = selectedFont === font.id;
          return (
            <motion.button
              key={font.id}
              onClick={() => setSelectedFont(font.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col justify-between text-right p-3.5 min-h-[110px] border transition-all duration-300 rounded-2xl cursor-pointer ${
                isSelected
                  ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] shadow-[0_0_15px_var(--accent3-transparent)]"
                  : "bg-black/25 hover:bg-black/40 border-[var(--border-color)] hover:border-[var(--accent3)]/40"
              }`}
            >
              {/* Top Meta info */}
              <div className="flex items-center justify-between w-full gap-1">
                <span
                  className={`text-[8.5px] font-bold tracking-tight font-preview-${font.id} ${isSelected ? "text-[var(--accent3)]" : "theme-text-muted"}`}
                >
                  {font.desc}
                </span>
                <span 
                  className={`font-black text-[10px] theme-text-primary font-preview-${font.id}`}
                >
                  {font.name}
                </span>
              </div>

              {/* Central Dynamic Scribe Preview Text */}
              <div className="w-full py-2 flex items-center justify-center overflow-hidden">
                <span
                  className={`text-[12px] font-bold text-center leading-relaxed transition-colors duration-300 font-preview-${font.id} ${
                    isSelected
                      ? "text-[var(--accent3)]"
                      : "theme-text-secondary group-hover:theme-text-primary"
                  }`}
                >
                  درود بر شما، به داشبورد خودتون خوش اومدین!!
                </span>
              </div>

              {/* Small Checkmark selection marker */}
              {isSelected && (
                <div className="absolute bottom-1.5 left-2 text-[var(--accent3)]">
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
