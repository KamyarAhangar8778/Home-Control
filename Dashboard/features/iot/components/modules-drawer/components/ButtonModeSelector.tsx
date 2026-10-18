import React from "react";
import { motion } from "motion/react";

interface ButtonModeSelectorProps {
  buttonMode: "switch" | "push";
  setButtonMode: (mode: "switch" | "push") => void;
  animationsEnabled: boolean;
}

export default function ButtonModeSelector({
  buttonMode,
  setButtonMode,
  animationsEnabled,
}: ButtonModeSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] theme-text-tertiary font-bold block">
        نوع عملکرد کلید کنترل:
      </label>
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          type="button"
          whileHover={animationsEnabled ? { scale: 1.03 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
          onClick={() => setButtonMode("switch")}
          className={`py-2 text-[10px] font-bold font-sans transition-all border rounded-xl cursor-pointer ${
            buttonMode === "switch"
              ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_12px_var(--accent3-transparent)]"
              : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
          }`}
        >
          سوییچ (دائمی Toggle)
        </motion.button>
        <motion.button
          type="button"
          whileHover={animationsEnabled ? { scale: 1.03 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
          onClick={() => setButtonMode("push")}
          className={`py-2 text-[10px] font-bold font-sans transition-all border rounded-xl cursor-pointer ${
            buttonMode === "push"
              ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_12px_var(--accent3-transparent)]"
              : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
          }`}
        >
          شستی (لحظه‌ای Shasti)
        </motion.button>
      </div>
    </div>
  );
}
