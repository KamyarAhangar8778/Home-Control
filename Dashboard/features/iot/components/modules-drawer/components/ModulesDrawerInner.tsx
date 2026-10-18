import React, { forwardRef } from "react";
import { motion } from "motion/react";
import DrawerHeader from "./DrawerHeader";
import AddSegmentForm from "./AddSegmentForm";
import SegmentList from "./SegmentList";
import ConnectionNote from "./ConnectionNote";
import { ModulesDrawerProps } from "../core/types";

const ModulesDrawerInner = forwardRef<HTMLDivElement, Omit<ModulesDrawerProps, "isOpen" | "isDark">>(({
  onClose,
  onAddSegment,
  segments,
  onRemoveSegment,
  animationsEnabled = true,
  accent3,
  accent4,
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 24, stiffness: 200 }}
      className="fixed top-0 left-0 h-full w-full max-w-sm bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-r border-accent3-medium rounded-r-[2.5rem] shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-6 py-8 text-right flex flex-col justify-between transition-colors duration-500"
    >
      <div className="space-y-6">
        <DrawerHeader onClose={onClose} animationsEnabled={animationsEnabled} />
        <AddSegmentForm
          onAddSegment={onAddSegment}
          onClose={onClose}
          segments={segments}
          animationsEnabled={animationsEnabled}
        />
        <SegmentList segments={segments} onRemoveSegment={onRemoveSegment} />
      </div>
      <ConnectionNote accent3={accent3} />
    </motion.div>
  );
});

export default ModulesDrawerInner;
