"use client";

import React from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";

interface MacroSidebarButtonProps {
  macro: any;
  isCenter?: boolean;
  onClick: () => void;
  isHorizontal: boolean;
  animationsEnabled: boolean;
  direction?: number;
  isSimpleList?: boolean;
  index?: number;
}

export default function MacroSidebarButton({
  macro,
  isCenter = false,
  onClick,
  isHorizontal,
  animationsEnabled,
  direction = 1,
  isSimpleList = false,
  index = 0,
}: MacroSidebarButtonProps) {
  if (isSimpleList) {
    return (
      <motion.button
        key={macro.id}
        initial={animationsEnabled ? { opacity: 0, [isHorizontal ? 'y' : 'x']: -20 } : undefined}
        animate={animationsEnabled ? { opacity: 1, [isHorizontal ? 'y' : 'x']: 0 } : undefined}
        exit={animationsEnabled ? { opacity: 0, scale: 0.8 } : undefined}
        transition={animationsEnabled ? { duration: 0.2, delay: index * 0.05 } : undefined}
        onClick={onClick}
        whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
        className={`flex items-center justify-center rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-primary)] md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)] md:hover:-translate-y-1.5 md:hover:shadow-[0_10px_20px_-5px_var(--accent3-transparent)] transition-all duration-300 shadow-sm relative group ${isHorizontal ? "flex-row gap-2 px-4 w-[120px] min-w-min min-h-[48px] h-fit py-2" : "flex-col w-[72px] min-w-min px-2 min-h-[72px] h-fit py-2"}`}
        title={macro.title}
      >
        {macro.icon ? (
          <span className={`${isHorizontal ? "text-xl" : "text-2xl mb-1"} md:group-hover:scale-110 transition-transform`}>
            {ICON_MAP[macro.icon] ? React.createElement(ICON_MAP[macro.icon], { className: isHorizontal ? "w-5 h-5" : "w-6 h-6" }) : macro.icon}
          </span>
        ) : (
          <Play className={`${isHorizontal ? "w-5 h-5" : "w-6 h-6 mb-1"} opacity-70 md:group-hover:scale-110 transition-transform`} />
        )}
        <span className={`${isHorizontal ? "text-xs" : "text-[10px] px-1 leading-tight"} font-bold text-center opacity-80 md:group-hover:opacity-100 transition-opacity`}>
          {macro.title}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      layout
      initial={animationsEnabled ? { 
        opacity: 0, 
        scale: 0.8,
        [isHorizontal ? "x" : "y"]: direction * 40
      } : undefined}
      animate={animationsEnabled ? { 
        opacity: isCenter ? 1 : 0.4, 
        scale: isCenter ? 1 : 0.85,
        x: 0, y: 0
      } : undefined}
      exit={animationsEnabled ? { 
        opacity: 0, 
        scale: 0.8,
        [isHorizontal ? "x" : "y"]: -direction * 40
      } : undefined}
      transition={animationsEnabled ? { duration: 0.3 } : undefined}
      onClick={onClick}
      className={`flex items-center justify-center rounded-2xl bg-[var(--card-bg-solid)] border ${isCenter ? 'border-[var(--accent3)] shadow-[0_4px_15px_-5px_var(--accent3-transparent)] z-10' : 'border-[var(--border-color)] md:hover:border-[var(--accent3)]'} text-[var(--text-primary)] ${isCenter ? 'text-[var(--accent3)]' : ''} transition-all duration-300 relative group shrink-0 ${isHorizontal ? "flex-row gap-1 px-2 w-[100px] min-w-[90px] min-h-[44px] h-fit py-2" : "flex-col w-[72px] min-w-min px-2 min-h-[72px] h-fit py-2"}`}
      title={macro.title}
    >
      {macro.icon ? (
        <span className={`${isHorizontal ? "text-xl" : "text-2xl mb-1"} ${isCenter ? 'scale-110' : 'md:group-hover:scale-110'} transition-transform`}>
          {ICON_MAP[macro.icon] ? React.createElement(ICON_MAP[macro.icon], { className: isHorizontal ? "w-5 h-5" : "w-6 h-6" }) : macro.icon}
        </span>
      ) : (
        <Play className={`${isHorizontal ? "w-5 h-5" : "w-6 h-6 mb-1"} ${isCenter ? 'opacity-100 scale-110' : 'opacity-70 md:group-hover:scale-110'} transition-all`} />
      )}
      <span className={`${isHorizontal ? "text-[10px]" : "text-[10px] px-1"} leading-tight font-bold text-center transition-opacity ${isCenter ? 'opacity-100' : 'opacity-60 md:group-hover:opacity-100'}`}>
        {macro.title}
      </span>
    </motion.button>
  );
}
