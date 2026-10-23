import React from "react";
import { SegmentData } from "../core/types";
import { CardFooter as ReUICardFooter } from "@/components/ui/card";

interface CardFooterProps {
  segment: SegmentData;
  isPinOn: boolean;
}

export default function CardFooter({ segment, isPinOn }: CardFooterProps) {
  return (
    <ReUICardFooter className="!gap-0 !rounded-b-xl !p-2 border-t border-[var(--border)] bg-[var(--muted)]/40 min-h-[24px]">
      <div className="flex justify-between items-center text-[8px] font-mono tracking-wider text-[var(--muted-foreground)] transition-colors">
        <span>SW STATE: {isPinOn ? "HIGH" : "LOW"}</span>
        <span>ADDR: PIN_{segment.pin}</span>
      </div>
    </ReUICardFooter>
  );
}
