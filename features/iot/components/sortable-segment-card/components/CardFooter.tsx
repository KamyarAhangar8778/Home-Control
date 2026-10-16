import React from "react";
import { SegmentData } from "../core/types";

interface CardFooterProps {
  segment: SegmentData;
  isPinOn: boolean;
}

export default function CardFooter({ segment, isPinOn }: CardFooterProps) {
  return (
    <div className="p-2 border-t border-[var(--border-color)] bg-black/10 min-h-[24px]">
      <div className="flex justify-between items-center text-[8px] font-mono tracking-wider text-gray-500 md:hover:text-[var(--accent3)] transition-colors">
        <span>SW STATE: {isPinOn ? "HIGH" : "LOW"}</span>
        <span>ADDR: PIN_{segment.pin}</span>
      </div>
    </div>
  );
}
