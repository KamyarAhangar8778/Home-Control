import type { PointerEvent } from "react";
import { Mic } from "lucide-react";
import type { VoiceCommandButtonProps } from "./types";

interface VerticalVoiceButtonProps extends VoiceCommandButtonProps {
  isListening: boolean;
  handlePointerDown: (e: PointerEvent) => void;
  handlePointerUp: (e: PointerEvent) => void;
  handlePointerCancel: (e: PointerEvent) => void;
}

export default function VerticalVoiceButton({
  animationsEnabled,
  isListening,
  handlePointerDown,
  handlePointerUp,
  handlePointerCancel,
}: VerticalVoiceButtonProps) {
  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: "none" }}
      className={`w-full flex items-center justify-between p-3 rounded-md border transition-colors duration-200 group select-none ${
        isListening
          ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)]"
          : "border-[var(--sidebar-border)] bg-[var(--sidebar-control-bg)] md:hover:bg-[var(--sidebar-hover)] md:hover:border-[var(--sidebar-border)] text-[var(--sidebar-muted)] md:hover:text-[var(--sidebar-text)]"
      }`}
      aria-label={isListening ? "در حال شنیدن فرمان صوتی" : "فرمان صوتی (نگه دارید)"}
    >
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-md transition-colors ${isListening ? "bg-[var(--accent4)] text-white" : "bg-[var(--sidebar-hover)] text-[var(--sidebar-text)]"}`}>
          <Mic aria-hidden="true" className={`w-4 h-4 ${isListening && animationsEnabled ? "animate-pulse" : ""}`} />
        </div>
        <span className="text-xs font-semibold">{isListening ? "در حال شنیدن..." : "فرمان صوتی (نگه دارید)"}</span>
      </div>
      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--sidebar-hover)] text-[var(--sidebar-muted)] font-mono">
        Voice
      </span>
    </button>
  );
}
