import React from "react";

interface Props {
  matrixDensity: number;
  setMatrixDensity: (val: number) => void;
  matrixSize: number;
  setMatrixSize: (val: number) => void;
  matrixHoverSize: number;
  setMatrixHoverSize: (val: number) => void;
  matrixOpacity: number;
  setMatrixOpacity: (val: number) => void;
}

export function MatrixSliders({
  matrixDensity, setMatrixDensity,
  matrixSize, setMatrixSize,
  matrixHoverSize, setMatrixHoverSize,
  matrixOpacity, setMatrixOpacity
}: Props) {
  return (
    <>
      {/* Density */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-4 relative z-10">
          <label className="text-sm font-bold text-[var(--text-primary)]">تراکم ماتریکس</label>
          <span className="text-xs font-mono text-[var(--accent3)] bg-[var(--accent3)]/10 px-2 py-1 rounded-md">
            {matrixDensity}px
          </span>
        </div>
        <input
          type="range" min="10" max="100" step="5"
          value={matrixDensity}
          onChange={(e) => setMatrixDensity(Number(e.target.value))}
          className="w-full accent-[var(--accent3)] relative z-10 cursor-pointer"
          dir="ltr"
        />
        <p className="text-[10px] text-[var(--text-secondary)] mt-2">
          فاصله بین علامت‌های (+) در پس‌زمینه را تعیین می‌کند. (مقدار کمتر = تراکم بیشتر)
        </p>
      </div>

      {/* Size */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-4 relative z-10">
          <label className="text-sm font-bold text-[var(--text-primary)]">اندازه پایه (+)</label>
          <span className="text-xs font-mono text-[var(--accent3)] bg-[var(--accent3)]/10 px-2 py-1 rounded-md">
            {matrixSize}
          </span>
        </div>
        <input
          type="range" min="1" max="20" step="1"
          value={matrixSize}
          onChange={(e) => setMatrixSize(Number(e.target.value))}
          className="w-full accent-[var(--accent3)] relative z-10 cursor-pointer"
          dir="ltr"
        />
      </div>

      {/* Hover Size */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-4 relative z-10">
          <label className="text-sm font-bold text-[var(--text-primary)]">میزان بزرگ‌نمایی در صورت جابجایی موس</label>
          <span className="text-xs font-mono text-[var(--accent3)] bg-[var(--accent3)]/10 px-2 py-1 rounded-md">
            {matrixHoverSize}
          </span>
        </div>
        <input
          type="range" min="0" max="20" step="1"
          value={matrixHoverSize}
          onChange={(e) => setMatrixHoverSize(Number(e.target.value))}
          className="w-full accent-[var(--accent3)] relative z-10 cursor-pointer"
          dir="ltr"
        />
      </div>

      {/* Opacity */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-4 relative z-10">
          <label className="text-sm font-bold text-[var(--text-primary)]">شفافیت ماتریکس (%)</label>
          <span className="text-xs font-mono text-[var(--accent3)] bg-[var(--accent3)]/10 px-2 py-1 rounded-md">
            {matrixOpacity}%
          </span>
        </div>
        <input
          type="range" min="5" max="100" step="5"
          value={matrixOpacity}
          onChange={(e) => setMatrixOpacity(Number(e.target.value))}
          className="w-full accent-[var(--accent3)] relative z-10 cursor-pointer"
          dir="ltr"
        />
      </div>
    </>
  );
}
