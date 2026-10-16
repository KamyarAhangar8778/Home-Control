import React from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { VoiceCommandButtonProps } from './types';

interface HorizontalVoiceButtonProps extends VoiceCommandButtonProps {
  isListening: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
}

export default function HorizontalVoiceButton({ 
  animationsEnabled, 
  isListening, 
  handlePointerDown, 
  handlePointerUp, 
  handlePointerCancel 
}: HorizontalVoiceButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`p-2 md:p-2.5 transition-all border rounded-xl flex justify-center items-center group select-none ${
        isListening
          ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)]"
          : "bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border-[var(--border-color)] text-[var(--text-secondary)] md:hover:text-blue-400 md:hover:border-blue-500/50"
      }`}
      title="فرمان صوتی (نگه دارید)"
    >
      <Mic className={`w-4 h-4 transition-transform duration-300 ${isListening && animationsEnabled ? "animate-pulse scale-110" : animationsEnabled ? "md:group-hover:scale-110" : ""}`} />
    </motion.button>
  );
}
