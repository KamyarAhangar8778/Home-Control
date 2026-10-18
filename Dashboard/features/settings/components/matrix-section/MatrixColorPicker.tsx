import React from "react";

interface Props {
  matrixColor: string;
  setMatrixColor: (val: string) => void;
  accent3: string;
  accent4: string;
}

export function MatrixColorPicker({ matrixColor, setMatrixColor, accent3, accent4 }: Props) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg">
      <label className="text-sm font-bold text-[var(--text-primary)] mb-4 block">رنگ ماتریکس</label>
      <div className="flex items-center gap-3 w-full" dir="ltr">
        <button
          onClick={() => setMatrixColor("#888888")}
          className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
            matrixColor === "#888888" 
              ? "border-[var(--text-primary)] scale-[1.02] shadow-md" 
              : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
          }`}
          style={{ backgroundColor: "#888888" }}
          title="خاکستری"
        />
        
        <button
          onClick={() => setMatrixColor(accent3)}
          className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
            matrixColor === accent3 
              ? "border-[var(--text-primary)] scale-[1.02] shadow-md" 
              : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
          }`}
          style={{ backgroundColor: accent3 }}
          title="رنگ سوم"
        />
        
        <button
          onClick={() => setMatrixColor(accent4)}
          className={`flex-1 h-12 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
            matrixColor === accent4 
              ? "border-[var(--text-primary)] scale-[1.02] shadow-md" 
              : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
          }`}
          style={{ backgroundColor: accent4 }}
          title="رنگ چهارم"
        />
      </div>
    </div>
  );
}
