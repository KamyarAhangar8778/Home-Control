import React from "react";
import { motion } from "motion/react";
import { X, Settings as SettingsIcon } from "lucide-react";

interface SettingsHeaderProps {
  onClose: () => void;
  animationsEnabled: boolean;
}

export function SettingsHeader({ onClose, animationsEnabled }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
      <motion.button
        onClick={onClose}
        whileHover={animationsEnabled ? { scale: 1.15, rotate: 90 } : undefined}
        whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
        className="p-1.5 rounded-md bg-[var(--secondary)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <X className="w-5 h-5" />
      </motion.button>
      <div className="flex items-center gap-2.5">
        <div>
          <h4
            className="font-sans font-semibold text-sm text-[var(--foreground)]"
          >
            منوی مدیریت و تنظیمات
          </h4>
          <p className="text-[9px] text-[var(--muted-foreground)] font-sans tracking-wide uppercase">
            Gateway Configuration Node
          </p>
        </div>
        <div className="p-2 rounded-md bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)]">
          <SettingsIcon
            className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
