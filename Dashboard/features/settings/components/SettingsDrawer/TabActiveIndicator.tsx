import React from "react";
import { motion } from "motion/react";
import { SETTINGS_TABS } from "./types";

interface TabActiveIndicatorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  animationsEnabled: boolean;
  isDark: boolean;
}

export function TabActiveIndicator({
  activeTab,
  setActiveTab,
  animationsEnabled,
  isDark,
}: TabActiveIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2.5 pb-1">
      {SETTINGS_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={animationsEnabled ? { scale: 1.35, rotate: 15 } : undefined}
            whileTap={animationsEnabled ? { scale: 0.85 } : undefined}
            className="transition-all duration-300 p-1 focus:outline-none cursor-pointer"
            title={tab.title}
          >
            <div
              className="w-1.5 h-1.5 transition-all duration-300"
              style={{
                transform: isActive ? "rotate(45deg) scale(1.35)" : "rotate(45deg) scale(0.9)",
                backgroundColor: isActive
                  ? "var(--accent3)"
                  : isDark
                    ? "rgba(255, 255, 255, 0.22)"
                    : "rgba(15, 23, 42, 0.25)",
                boxShadow: isActive ? "0 0 6px var(--accent3)" : "none",
              }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
