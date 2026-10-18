import React from "react";
import { motion } from "motion/react";
import { Settings as SettingsIcon, ChevronLeft } from "lucide-react";

interface SettingsPortalButtonProps {
  onClick: () => void;
}

export default function SettingsPortalButton({ onClick }: SettingsPortalButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.985 }}
      className="relative group flex items-center justify-between gap-3 px-5 py-3.5 bg-[var(--card-bg-solid)] border border-[var(--border-color)] md:hover:border-[var(--accent3)] md:hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] rounded-xl font-sans font-extrabold text-xs md:text-sm cursor-pointer shadow-sm transition-all duration-300 text-right w-full"
    >
      <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--accent3)] md:group-hover:bg-[var(--accent3-transparent)] transition-colors">
        <SettingsIcon className="w-4 h-4 group-md:hover:rotate-45 transition-transform duration-300" />
      </div>
      <span className="flex-1 pr-2 text-[var(--text-primary)] font-sans font-bold">
        مشاهده تنظیمات سامانه
      </span>
      <ChevronLeft className="w-4 h-4 text-[var(--text-muted)]" />
    </motion.button>
  );
}
