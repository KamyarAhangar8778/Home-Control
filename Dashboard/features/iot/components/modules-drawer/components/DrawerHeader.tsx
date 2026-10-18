import React from "react";
import { motion } from "motion/react";
import { X, Layers } from "lucide-react";

interface DrawerHeaderProps {
  onClose: () => void;
  animationsEnabled: boolean;
}

export default function DrawerHeader({ onClose, animationsEnabled }: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-accent3-medium pb-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 theme-card-bg-solid border border-accent3-medium text-accent3">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h4
            className="font-sans font-black text-sm text-accent3"
            style={{ color: "var(--accent3)" }}
          >
            منوی مدیریت ماژول‌ها و سگمنت‌ها
          </h4>
          <p className="text-[9px] theme-text-muted font-sans tracking-wide uppercase">
            Modular IoT Panel Node
          </p>
        </div>
      </div>
      <motion.button
        onClick={onClose}
        whileHover={animationsEnabled ? { scale: 1.15, rotate: 90 } : undefined}
        whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
        className="p-1.5 rounded-full theme-card-bg-solid border theme-border theme-text-tertiary md:hover:text-accent3 md:hover:border-accent3 transition-colors cursor-pointer focus:outline-none"
      >
        <X className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
