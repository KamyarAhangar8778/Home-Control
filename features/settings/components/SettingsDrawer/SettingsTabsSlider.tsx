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
        className="border border-[var(--border)] rounded-lg p-2 flex items-center justify-between gap-1 bg-[var(--card)] relative overflow-hidden transition-colors duration-200"
      >
        <motion.button
          onClick={handlePrev}
          whileHover={animationsEnabled ? { scale: 1.12, rotate: 3 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
          className="p-1.5 rounded-md border border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
          title="بخش قبلی"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        <div className="flex-1 grid grid-cols-12 gap-1 items-center justify-start text-right px-1 select-none overflow-hidden min-h-[58px]">
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
          className="p-1.5 rounded-md border border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
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
