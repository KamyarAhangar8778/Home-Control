import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SETTINGS_TABS } from "./types";
import { TabPreviewButton } from "./TabPreviewButton";
import { TabActiveIndicator } from "./TabActiveIndicator";
import { TabActiveLabel } from "./TabActiveLabel";

interface SettingsTabsSliderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  animationsEnabled: boolean;
  isDark: boolean;
  accent3: string;
}

export function SettingsTabsSlider({
  activeTab,
  setActiveTab,
  animationsEnabled,
  isDark,
  accent3,
}: SettingsTabsSliderProps) {
  const handleNext = () => {
    const currIndex = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
    const nextIndex = (currIndex + 1) % SETTINGS_TABS.length;
    setActiveTab(SETTINGS_TABS[nextIndex].id);
  };

  const handlePrev = () => {
    const currIndex = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
    const prevIndex = (currIndex - 1 + SETTINGS_TABS.length) % SETTINGS_TABS.length;
    setActiveTab(SETTINGS_TABS[prevIndex].id);
  };

  const currIndex = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
  const prevIndex = (currIndex - 1 + SETTINGS_TABS.length) % SETTINGS_TABS.length;
  const nextIndex = (currIndex + 1) % SETTINGS_TABS.length;

  return (
    <div className="space-y-3">
      <div
        className={`border rounded-2xl p-2.5 flex items-center justify-between gap-1 shadow-inner relative overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-slate-950/40 border-accent3-medium/50" : "bg-white/60 border-slate-200/90"
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent3 to-transparent opacity-80" />

        <motion.button
          onClick={handlePrev}
          whileHover={animationsEnabled ? { scale: 1.12, rotate: 3 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
          className={`p-1.5 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
            isDark
              ? "border-accent3-medium/30 bg-black/50 text-accent3 hover:text-accent4 hover:border-accent4"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:text-accent3 hover:border-accent3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          }`}
          title="بخش قبلی"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        <div className="flex-1 grid grid-cols-12 gap-1 items-center justify-center text-center px-1 select-none overflow-hidden min-h-[58px]">
          <TabPreviewButton
            onClick={handlePrev}
            animationsEnabled={animationsEnabled}
            title={SETTINGS_TABS[prevIndex].title}
            compactTitle={SETTINGS_TABS[prevIndex].compactTitle}
            isDark={isDark}
            isLeft={false}
          />

          <TabActiveLabel activeTab={activeTab} isDark={isDark} />

          <TabPreviewButton
            onClick={handleNext}
            animationsEnabled={animationsEnabled}
            title={SETTINGS_TABS[nextIndex].title}
            compactTitle={SETTINGS_TABS[nextIndex].compactTitle}
            isDark={isDark}
            isLeft={true}
          />
        </div>

        <motion.button
          onClick={handleNext}
          whileHover={animationsEnabled ? { scale: 1.12, rotate: -3 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
          className={`p-1.5 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
            isDark
              ? "border-accent3-medium/30 bg-black/50 text-accent3 hover:text-accent4 hover:border-accent4"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:text-accent3 hover:border-accent3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          }`}
          title="بخش بعدی"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
      </div>

      <TabActiveIndicator
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        animationsEnabled={animationsEnabled}
        isDark={isDark}
      />
    </div>
  );
}
