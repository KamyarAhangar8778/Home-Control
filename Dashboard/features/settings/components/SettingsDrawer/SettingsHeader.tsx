import React from "react";
import { motion } from "motion/react";
import { X, Settings as SettingsIcon } from "lucide-react";

interface SettingsHeaderProps {
  onClose: () => void;
  animationsEnabled: boolean;
}

export function SettingsHeader({ onClose, animationsEnabled }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-accent3-medium pb-4">
      <motion.button
        onClick={onClose}
        whileHover={animationsEnabled ? { scale: 1.15, rotate: 90 } : undefined}
        whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
        className="p-1.5 rounded-full theme-card-bg-solid border theme-border theme-text-tertiary hover:text-accent3 hover:border-accent3 transition-colors cursor-pointer focus:outline-none"
      >
        <X className="w-5 h-5" />
      </motion.button>
      <div className="flex items-center gap-2.5">
        <div>
          <h4
            className="font-sans font-black text-sm text-accent3"
            style={{ color: "var(--accent3)" }}
          >
            منوی مدیریت و تنظیمات
          </h4>
          <p className="text-[9px] theme-text-muted font-sans tracking-wide uppercase">
            Gateway Configuration Node
          </p>
        </div>
        <div className="p-2 theme-card-bg-solid border border-accent3-medium text-accent3">
          <SettingsIcon
            className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
