import React from "react";
import { Move, MousePointer2, Sparkles } from "lucide-react";

interface Props {
  matrixMoving: boolean;
  setMatrixMoving: (val: boolean) => void;
  matrixMouseEffect: boolean;
  setMatrixMouseEffect: (val: boolean) => void;
  matrixTwinkleEffect: boolean;
  setMatrixTwinkleEffect: (val: boolean) => void;
  matrixTwinkleSpeed: number;
  setMatrixTwinkleSpeed: (val: number) => void;
}

export function MatrixToggles({
  matrixMoving, setMatrixMoving,
  matrixMouseEffect, setMatrixMouseEffect,
  matrixTwinkleEffect, setMatrixTwinkleEffect,
  matrixTwinkleSpeed, setMatrixTwinkleSpeed
}: Props) {
  return (
    <>
      <div className="space-y-3">
        <label className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--accent3)]/50 transition-colors">
          <div className="flex items-center gap-3">
            <Move className={`w-5 h-5 ${matrixMoving ? 'text-[var(--accent3)]' : 'text-[var(--text-secondary)]'}`} />
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">متحرک بودن ماتریکس</div>
              <div className="text-[10px] text-[var(--text-secondary)]">جابجایی پیوسته نقاط در پس‌زمینه</div>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${matrixMoving ? 'bg-[var(--accent3)]' : 'bg-[var(--bg-surface)] border border-[var(--border-color)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${matrixMoving ? '-translate-x-4' : 'translate-x-0'}`} />
          </div>
          <input
            type="checkbox" checked={matrixMoving} onChange={(e) => setMatrixMoving(e.target.checked)} className="hidden"
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--accent3)]/50 transition-colors">
          <div className="flex items-center gap-3">
            <MousePointer2 className={`w-5 h-5 ${matrixMouseEffect ? 'text-[var(--accent3)]' : 'text-[var(--text-secondary)]'}`} />
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">افکت پویای موس</div>
              <div className="text-[10px] text-[var(--text-secondary)]">بزرگ‌نمایی نقاط اطراف موس</div>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${matrixMouseEffect ? 'bg-[var(--accent3)]' : 'bg-[var(--bg-surface)] border border-[var(--border-color)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${matrixMouseEffect ? '-translate-x-4' : 'translate-x-0'}`} />
          </div>
          <input
            type="checkbox" checked={matrixMouseEffect} onChange={(e) => setMatrixMouseEffect(e.target.checked)} className="hidden"
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--accent3)]/50 transition-colors">
          <div className="flex items-center gap-3">
            <Sparkles className={`w-5 h-5 ${matrixTwinkleEffect ? 'text-[var(--accent3)]' : 'text-[var(--text-secondary)]'}`} />
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">چشمک‌زن ستاره‌ای</div>
              <div className="text-[10px] text-[var(--text-secondary)]">روشن و خاموش شدن تصادفی نقطه‌ها</div>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${matrixTwinkleEffect ? 'bg-[var(--accent3)]' : 'bg-[var(--bg-surface)] border border-[var(--border-color)]'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${matrixTwinkleEffect ? '-translate-x-4' : 'translate-x-0'}`} />
          </div>
          <input
            type="checkbox" checked={matrixTwinkleEffect} onChange={(e) => setMatrixTwinkleEffect(e.target.checked)} className="hidden"
          />
        </label>
      </div>

      {matrixTwinkleEffect && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <label className="text-sm font-bold text-[var(--text-primary)]">سرعت چشمک‌زدن</label>
            <span className="text-xs font-mono text-[var(--accent3)] bg-[var(--accent3)]/10 px-2 py-1 rounded-md">
              {matrixTwinkleSpeed}
            </span>
          </div>
          <input
            type="range" min="10" max="200" step="10"
            value={matrixTwinkleSpeed}
            onChange={(e) => setMatrixTwinkleSpeed(Number(e.target.value))}
            className="w-full accent-[var(--accent3)] relative z-10 cursor-pointer"
            dir="ltr"
          />
        </div>
      )}
    </>
  );
}
