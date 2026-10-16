import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, ChevronLeft } from "lucide-react";
import { HeaderSettingsSectionProps } from "./types";
import HeaderSettingsContent from "./HeaderSettingsContent";

export default function HeaderSettingsSection({
  headerTitle,
  setHeaderTitle,
  expandedSection,
  toggleSection,
  headerPosition,
  setHeaderPosition,
  hideHeader = false,
}: HeaderSettingsSectionProps) {
  const isExpanded = hideHeader ? true : expandedSection === "header-settings";

  if (hideHeader) {
    return (
      <div className="theme-card-bg-solid border border-accent3-medium/30 p-4 space-y-4 overflow-hidden rounded-2xl text-right">
        <HeaderSettingsContent
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
        />
      </div>
    );
  }

  return (
    <div className="border border-accent3-medium overflow-hidden transition-all duration-300 rounded-2xl">
      <button
        onClick={() => toggleSection && toggleSection("header-settings")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right cursor-pointer hover:bg-[var(--card-hover-bg)] transition-colors"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">موقعیت و تنظیمات هدر</span>
          <LayoutGrid className="w-4 h-4 text-accent4" style={{ color: "var(--accent4)" }} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="theme-card-bg-solid border-t border-accent3-medium/30 p-4 space-y-4 overflow-hidden text-right"
          >
            <HeaderSettingsContent
              headerPosition={headerPosition}
              setHeaderPosition={setHeaderPosition}
              headerTitle={headerTitle}
              setHeaderTitle={setHeaderTitle}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
