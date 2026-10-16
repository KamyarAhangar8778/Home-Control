import React from 'react';
import { motion } from 'motion/react';

interface FilterButtonProps {
  group: string | null;
  isCenter: boolean;
  onClick: () => void;
  uniqueKey: string;
  animationsEnabled: boolean;
  direction: number;
  isCompact: boolean;
}

export default function FilterButton({
  group,
  isCenter,
  onClick,
  uniqueKey,
  animationsEnabled,
  direction,
  isCompact
}: FilterButtonProps) {
  const getLabel = (item: string | null) => item === null ? "همه گروه‌ها" : (item || "گروه بدون نام");

  return (
    <motion.button
      layout
      key={uniqueKey}
      initial={animationsEnabled ? { 
        opacity: 0, 
        scale: 0.8,
        x: direction * 40
      } : undefined}
      animate={animationsEnabled ? { 
        opacity: isCenter ? 1 : 0.4, 
        scale: isCenter ? 1 : 0.85,
        x: 0, y: 0
      } : undefined}
      exit={animationsEnabled ? { 
        opacity: 0, 
        scale: 0.8,
        x: -direction * 40
      } : undefined}
      transition={animationsEnabled ? { duration: 0.3 } : undefined}
      onClick={onClick}
      className={`flex items-center justify-center bg-[var(--card-bg-solid)] border ${isCompact ? 'rounded-md h-5 min-w-[70px] max-w-[120px] gap-1 px-2' : 'rounded-2xl h-12 w-[140px] gap-2 px-4'} ${isCenter ? (isCompact ? 'border-[var(--accent3)] shadow-[0_2px_8px_-3px_var(--accent3-transparent)] z-10' : 'border-[var(--accent3)] shadow-[0_4px_15px_-5px_var(--accent3-transparent)] z-10') : 'hidden md:flex border-[var(--border-color)] md:hover:border-[var(--accent3)]'} text-[var(--text-primary)] ${isCenter ? 'text-[var(--accent3)]' : 'text-[var(--text-muted)]'} transition-all duration-300 relative group flex-row whitespace-nowrap overflow-hidden shrink-0`}
      title={getLabel(group)}
    >
      <span className={`${isCompact ? 'font-mono text-[9px] leading-none' : 'font-bold text-sm'} truncate max-w-full`}>
        {getLabel(group)}
      </span>
    </motion.button>
  );
}
