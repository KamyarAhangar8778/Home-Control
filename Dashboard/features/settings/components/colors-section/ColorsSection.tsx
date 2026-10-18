import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, ChevronLeft } from "lucide-react";
import { HeritagePreset } from "@/lib/presets";
import { ColorsSectionProps } from "./types";
import HeritagePresetsList from "./HeritagePresetsList";
import CircularPickers from "./CircularPickers";
import HexInputs from "./HexInputs";
import TalismanStatus from "./TalismanStatus";

export default function ColorsSectionComponent({
  accent3,
  setAccent3,
  accent4,
  setAccent4,
  expandedSection,
  toggleSection,
  hideHeader = false,
}: ColorsSectionProps) {
  const selectPreset = (preset: HeritagePreset) => {
    setAccent3(preset.accent3);
    setAccent4(preset.accent4);
  };

  const isExpanded = hideHeader ? true : expandedSection === "colors";

  const renderContent = () => (
    <div className="space-y-5 text-right font-sans">
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        این داشبورد مجهز به سیستم پایداری ۴ رنگی است. رنگ‌های اصلی (سیاه، سفید و خاکستری) همواره ثابت
        هستند. شما می‌توانید رنگ‌های اختیاری سوم و چهارم را در زیر پیکربندی نمایید:
      </p>

      <HeritagePresetsList accent3={accent3} accent4={accent4} onSelectPreset={selectPreset} />

      <div className="border-t border-accent3-medium/20 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] theme-text-tertiary">سازش فرکانس‌های دلخواه</span>
          <label className="text-[10px] theme-text-tertiary block font-bold">
            تنظیم رنگ‌بندی دلخواه شما:
          </label>
        </div>

        <CircularPickers
          accent3={accent3}
          setAccent3={setAccent3}
          accent4={accent4}
          setAccent4={setAccent4}
        />

        <HexInputs
          accent3={accent3}
          setAccent3={setAccent3}
          accent4={accent4}
          setAccent4={setAccent4}
        />
      </div>

      <TalismanStatus accent3={accent3} accent4={accent4} />
    </div>
  );

  if (hideHeader) {
    return (
      <div className="theme-card-bg-solid border border-accent3-medium/30 p-4 space-y-4 overflow-hidden rounded-2xl text-right">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="border border-accent3-medium overflow-hidden transition-all duration-300 rounded-2xl">
      <button
        onClick={() => toggleSection && toggleSection("colors")}
        className="w-full py-3 px-4 bg-[var(--card-bg-solid)] flex items-center justify-between text-right hover:bg-[var(--card-hover-bg)] transition-colors cursor-pointer"
      >
        <ChevronLeft
          className="w-4 h-4 text-accent3 transition-transform duration-300"
          style={{ transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold theme-text-primary">
            تنظیم تنوع رنگ و تضاد (رنگ ۳ و ۴)
          </span>
          <Palette className="w-4 h-4 text-accent3" />
        </div>
      </button>

      <AnimatePresence initial={false}>
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
