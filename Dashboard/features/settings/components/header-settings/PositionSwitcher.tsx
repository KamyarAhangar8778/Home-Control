import React from "react";
import { motion } from "motion/react";
import { PanelTop, PanelLeft } from "lucide-react";

interface PositionSwitcherProps {
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
}

export default function PositionSwitcher({
  headerPosition,
  setHeaderPosition,
}: PositionSwitcherProps) {
  const handlePositionChange = (pos: "top" | "left") => {
    setHeaderPosition(pos);
  };

  return (
    <div className="space-y-3">
      <span className="font-bold text-[10px] theme-text-secondary tracking-wide block">
        موقعیت قرارگیری هدر داشبورد
      </span>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {/* Position 1: Top */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handlePositionChange("top")}
          className={`p-3 text-right transition-all border rounded-xl flex items-center justify-between cursor-pointer w-full ${
            headerPosition === "top"
              ? "border-[var(--accent4)] bg-[var(--accent4-transparent)] shadow-[0_0_12px_var(--accent4-transparent)]"
              : "border-[var(--border-color)] hover:border-[var(--accent4)]/60 bg-black/10 hover:bg-black/20"
          }`}
        >
          <PanelTop
            className={`w-4 h-4 ${headerPosition === "top" ? "text-[var(--accent4)]" : "theme-text-muted"}`}
          />
          <span
            className={`font-bold text-[11px] ${headerPosition === "top" ? "theme-text-primary" : "theme-text-secondary"}`}
          >
            هدر پهن بالا
          </span>
        </motion.button>

        {/* Position 2: Left */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handlePositionChange("left")}
          className={`p-3 text-right transition-all border rounded-xl flex items-center justify-between cursor-pointer w-full ${
            headerPosition === "left"
              ? "border-[var(--accent4)] bg-[var(--accent4-transparent)] shadow-[0_0_12px_var(--accent4-transparent)]"
              : "border-[var(--border-color)] hover:border-[var(--accent4)]/60 bg-black/10 hover:bg-black/20"
          }`}
        >
          <PanelLeft
            className={`w-4 h-4 ${headerPosition === "left" ? "text-[var(--accent4)]" : "theme-text-muted"}`}
          />
          <span
            className={`font-bold text-[11px] ${headerPosition === "left" ? "theme-text-primary" : "theme-text-secondary"}`}
          >
            منوی ستونی چپ
          </span>
        </motion.button>
      </div>
    </div>
  );
}
