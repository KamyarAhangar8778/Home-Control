import React from "react";
import { SegmentData } from "../core/types";
import PinToggle from "./PinToggle";

interface CardBodyProps {
  segment: SegmentData;
  isPinOn: boolean;
  isCompact: boolean;
  isUltraCompact: boolean;
  isMobileTwoCol?: boolean;
  densityFactor?: number;
  mode: "switch" | "push";
  buttonProps: any;
  animationsEnabled?: boolean;
}

export default function CardBody({
  segment,
  isPinOn,
  isCompact,
  isUltraCompact,
  isMobileTwoCol,
  densityFactor = 0,
  mode,
  buttonProps,
  animationsEnabled = true,
}: CardBodyProps) {
  return (
    <div className={`${isUltraCompact ? "p-2 flex-grow flex items-center justify-center" : isCompact ? "p-3 flex-1 flex items-center" : "p-4 flex-1"}`}>
      {segment.type === "input" ? (
        <div className="flex items-center justify-between bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] rounded-xl w-full">
          <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 border rounded-lg ${
            isPinOn ? "border-[var(--accent4)] text-[var(--accent4)] bg-[var(--accent4-transparent)]" : "border-gray-500 text-gray-400"
          }`}>
            {isPinOn ? "ورودی HIGH (1)" : "ورودی LOW (0)"}
          </span>
          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="block text-xs font-sans font-bold theme-text-primary">
                وضیعت پایه {segment.pin}
              </span>
              <span className="block text-[9px] theme-text-muted mt-0.5">
                Digital Input Status
              </span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${isPinOn ? "bg-[var(--accent4-transparent)]" : "bg-gray-800"}`} style={{ boxShadow: isPinOn ? 'inset 0 0 10px var(--accent4-transparent)' : '' }}>
              <div className={`w-4 h-4 rounded-full ${isPinOn ? "bg-[var(--accent4)] animate-pulse" : "bg-gray-600"}`} style={{ boxShadow: isPinOn ? '0 0 15px var(--accent4)' : '' }} />
            </div>
          </div>
        </div>
      ) : isUltraCompact ? (
        <div className="flex items-center justify-center w-full">
          <PinToggle
            isPinOn={isPinOn}
            buttonProps={buttonProps}
            animationsEnabled={animationsEnabled}
            isUltraCompact={true}
          />
        </div>
      ) : isMobileTwoCol ? (
        <div className="flex flex-col items-center justify-center w-full bg-[var(--card-bg-solid)] p-2 border border-[var(--border-color)] rounded-xl overflow-hidden h-full gap-2">
          <span className="text-[10px] font-sans font-bold theme-text-secondary line-clamp-2 leading-tight text-center w-full" title={segment.title}>
            {segment.title}
          </span>
          <PinToggle
            isPinOn={isPinOn}
            buttonProps={buttonProps}
            animationsEnabled={animationsEnabled}
            isVertical={false}
          />
        </div>
      ) : isCompact ? (
        <div className="flex items-center justify-between w-full bg-[var(--card-bg-solid)] p-2 border border-[var(--border-color)] rounded-xl overflow-hidden h-full">
          <span className="text-[10px] font-sans font-bold theme-text-secondary line-clamp-2 leading-tight pl-2 flex-1 text-right" title={segment.title}>
            {segment.title}
          </span>
          <PinToggle
            isPinOn={isPinOn}
            buttonProps={buttonProps}
            animationsEnabled={animationsEnabled}
            isVertical={densityFactor >= 4}
          />
        </div>
      ) : (
        <div className="flex items-center justify-end bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] rounded-xl w-full">
          <div className="flex items-center gap-3 text-right">
            <span className="block font-sans font-extrabold theme-text-primary text-xs">
              {segment.title}
            </span>
            <PinToggle
              isPinOn={isPinOn}
              buttonProps={buttonProps}
              animationsEnabled={animationsEnabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}
