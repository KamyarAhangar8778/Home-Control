import React from 'react';
import { Mic } from 'lucide-react';
import { VoiceCommandButtonProps } from './types';

interface VerticalVoiceButtonProps extends VoiceCommandButtonProps {
  isListening: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
}

export default function VerticalVoiceButton({ 
  animationsEnabled, 
  isListening, 
  handlePointerDown, 
  handlePointerUp, 
  handlePointerCancel 
}: VerticalVoiceButtonProps) {
  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 transform active:scale-[0.98] group select-none ${
        isListening 
          ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)]" 
          : "border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-blue-500/50 text-[var(--text-secondary)] md:hover:text-blue-400"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg transition-all ${isListening ? "bg-[var(--accent4)] text-white" : "bg-blue-500/10 text-blue-500"}`}>
          <Mic className={`w-4 h-4 ${isListening && animationsEnabled ? "animate-pulse" : ""}`} />
        </div>
        <span className="text-xs font-semibold">{isListening ? "در حال شنیدن..." : "فرمان صوتی (نگه دارید)"}</span>
      </div>
      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
        Voice
      </span>
    </button>
  );
}
