"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Type, ChevronLeft } from "lucide-react";
import { ACCORDION_CLIP } from "@/lib/presets";
import { TypographySectionProps } from "./types";
import FontGrid from "./FontGrid";

export default function TypographySection({
  selectedFont,
  setSelectedFont,
  expandedSection,
  toggleSection,
  hideHeader = false,
}: TypographySectionProps) {
  const isExpanded = hideHeader ? true : expandedSection === "fonts";

  const renderContent = () => (
    <FontGrid selectedFont={selectedFont} setSelectedFont={setSelectedFont} />
  );

  if (hideHeader) {
    return (
      <div className="theme-card-bg-solid border border-accent3-medium/30 p-4 space-y-4 overflow-hidden rounded-xl text-right">
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      className="border border-accent3-medium overflow-hidden transition-all duration-300"
      style={{ clipPath: ACCORDION_CLIP }}
    >
      <button
        onClick={() => toggleSection && toggleSection("fonts")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right hover:bg-[var(--card-hover-bg)] transition-colors cursor-pointer"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">مدیریت قلم و تایپوگرافی</span>
          <Type className="w-4 h-4 text-accent3" />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="theme-card-bg-solid border-t border-accent3-medium/30 p-4 space-y-4 overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
