import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";

interface HexInputsProps {
  accent3: string;
  setAccent3: (val: string) => void;
  accent4: string;
  setAccent4: (val: string) => void;
}

export default function HexInputs({ accent3, setAccent3, accent4, setAccent4 }: HexInputsProps) {
  const [showHexInputs, setShowHexInputs] = React.useState(false);

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setShowHexInputs(!showHexInputs)}
        className="w-full py-2 px-3.5 mt-1 text-[10px] theme-text-secondary font-semibold hover:theme-text-primary transition-colors flex items-center justify-between border border-[var(--border-color)] bg-black/10 hover:bg-black/20 rounded-xl cursor-pointer"
      >
        <ChevronLeft
          className="w-3.5 h-3.5 text-accent3 transition-transform duration-300"
          style={{ transform: showHexInputs ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
        <span className="flex items-center gap-1.5">تنظیم پیشرفته کد رنگ دستی (HEX)</span>
      </button>

      <AnimatePresence initial={false}>
        {showHexInputs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 pt-3.5 pb-1">
              {/* Accent 3 Hex input */}
              <div className="space-y-1 text-right">
                <span className="text-[9.5px] theme-text-muted block font-sans">
                  کد هگز رنگ سوم:
                </span>
                <input
                  type="text"
                  value={accent3}
                  onChange={(e) => setAccent3(e.target.value)}
                  placeholder="#000000"
                  className="w-full text-center bg-slate-900/50 border border-[var(--border-color)] text-[11px] font-mono py-2 focus:outline-none focus:border-accent3 theme-text-primary rounded-xl uppercase"
                />
              </div>

              {/* Accent 4 Hex input */}
              <div className="space-y-1 text-right">
                <span className="text-[9.5px] theme-text-muted block font-sans">
                  کد هگز رنگ چهارم:
                </span>
                <input
                  type="text"
                  value={accent4}
                  onChange={(e) => setAccent4(e.target.value)}
                  placeholder="#000000"
                  className="w-full text-center bg-slate-900/50 border border-[var(--border-color)] text-[11px] font-mono py-2 focus:outline-none focus:border-accent4 theme-text-primary rounded-xl uppercase"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
