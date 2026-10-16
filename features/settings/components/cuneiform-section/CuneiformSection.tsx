"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronLeft } from "lucide-react";
import CuneiformContent from "./CuneiformContent";
import { CuneiformSectionProps } from "./types";

export default function CuneiformSection({
  cuneiformOpacity,
  setCuneiformOpacity,
  cuneiformColor,
  setCuneiformColor,
  expandedSection,
  toggleSection,
  hideHeader = false,
}: CuneiformSectionProps) {
  const isExpanded = hideHeader ? true : expandedSection === "cuneiform";

  if (hideHeader) {
    return (
      <div className="theme-card-bg-solid border border-accent3-medium/30 p-4 space-y-4 overflow-hidden rounded-2xl text-right">
        <CuneiformContent
          cuneiformOpacity={cuneiformOpacity}
          setCuneiformOpacity={setCuneiformOpacity}
          cuneiformColor={cuneiformColor}
          setCuneiformColor={setCuneiformColor}
        />
      </div>
    );
  }

  return (
    <div className="border border-accent3-medium overflow-hidden transition-all duration-300 rounded-2xl">
      <button
        onClick={() => toggleSection && toggleSection("cuneiform")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right cursor-pointer hover:bg-[var(--card-hover-bg)] transition-colors"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">
            تنظیمات کتیبه خط میخی پس‌زمینه
          </span>
          <Sparkles className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
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
            <CuneiformContent
              cuneiformOpacity={cuneiformOpacity}
              setCuneiformOpacity={setCuneiformOpacity}
              cuneiformColor={cuneiformColor}
              setCuneiformColor={setCuneiformColor}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
