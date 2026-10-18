import React from "react";
import { motion } from "motion/react";

interface TabPreviewButtonProps {
  onClick: () => void;
  animationsEnabled: boolean;
  title: string;
  compactTitle: string;
  isDark: boolean;
  isLeft: boolean;
}

export function TabPreviewButton({
  onClick,
  animationsEnabled,
  title,
  compactTitle,
  isDark,
  isLeft,
}: TabPreviewButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={animationsEnabled ? { scale: 1.06, y: -1 } : undefined}
      whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
      className={`col-span-3 ${
        isLeft ? "text-left" : "text-right"
      } group focus:outline-none cursor-pointer transition-all duration-300 overflow-hidden`}
      title={title}
    >
      <span
        className={`block text-[8px] font-sans font-medium truncate opacity-30 group-hover:opacity-75 transition-opacity ${
          isDark ? "text-gray-400" : "text-slate-500"
        }`}
      >
        {compactTitle}
      </span>
    </motion.button>
  );
}
