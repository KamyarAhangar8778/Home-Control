import React from "react";
import { motion } from "motion/react";
import { SortableSegmentCardProps } from "../core/types";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import useSegmentButtonProps from "../hooks/useSegmentButtonProps";
import { useAutoOffTimer } from "../hooks/useAutoOffTimer";

interface ActiveCardProps
  extends Omit<SortableSegmentCardProps, "onSetupPlaceholder" | "isLoadingIoT"> {
  isCompact: boolean;
  isUltraCompact: boolean;
  isMobileTwoCol?: boolean;
  densityFactor?: number;
  attributes: any;
  listeners: any;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (val: boolean) => void;
}

function ActiveCard({
  segment,
  isPinOn = false,
  onRemove,
  onTogglePin,
  onSetPinState,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  onUpdateSegmentRule,
  parentGroupsCols,
  groupMaxCols,
  animationsEnabled = true,
  isCompact,
  isUltraCompact,
  isMobileTwoCol,
  densityFactor,
  attributes,
  listeners,
  isSettingsOpen,
  setIsSettingsOpen,
}: ActiveCardProps) {
  const mode = segment.mode || "switch";
  const buttonProps = useSegmentButtonProps({
    mode,
    pin: segment.pin,
    onTogglePin,
    onSetPinState,
  });

  const { countdown } = useAutoOffTimer({
    isPinOn,
    autoOff: segment.auto_off,
    mode,
    pin: segment.pin,
    onSetPinState,
  });

  return (
    <motion.div
      layout={animationsEnabled ? "position" : false}
      transition={animationsEnabled ? { type: "spring", stiffness: 380, damping: 32 } : undefined}
      initial={animationsEnabled ? { opacity: 0, scale: 0.93, y: 10 } : false}
      animate={animationsEnabled ? { opacity: 1, scale: 1, y: 0 } : false}
      exit={
        animationsEnabled
          ? { opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
          : undefined
      }
      className={`flex flex-col bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] relative group h-full shadow-sm rounded-2xl ${
        isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"
      }`}
    >
      <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-350 md:group-hover:opacity-100 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 md:group-hover:border-accent3/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 md:group-hover:border-accent3/40 pointer-events-none" />

      <div className="flex flex-col h-full justify-between relative z-10">
        <CardHeader
          segment={segment}
          isPinOn={isPinOn}
          isUltraCompact={isUltraCompact}
          isCompact={isCompact}
          mode={mode}
          onRemove={onRemove}
          onUpdateSegmentMode={onUpdateSegmentMode}
          attributes={attributes}
          listeners={listeners}
          countdown={countdown}
          onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          groupMaxCols={groupMaxCols}
        />

        <CardBody
          segment={segment}
          isPinOn={isPinOn}
          isCompact={isCompact}
          isUltraCompact={isUltraCompact}
          isMobileTwoCol={isMobileTwoCol}
          densityFactor={densityFactor}
          mode={mode}
          buttonProps={buttonProps}
          animationsEnabled={animationsEnabled}
        />

        {!isUltraCompact && !isCompact && <CardFooter segment={segment} isPinOn={isPinOn} />}
      </div>
    </motion.div>
  );
}

export default React.memo(ActiveCard, (prev, next) => {
  return (
    prev.segment === next.segment &&
    prev.isPinOn === next.isPinOn &&
    prev.isCompact === next.isCompact &&
    prev.isUltraCompact === next.isUltraCompact &&
    prev.isMobileTwoCol === next.isMobileTwoCol &&
    prev.densityFactor === next.densityFactor &&
    prev.parentGroupsCols === next.parentGroupsCols &&
    prev.groupMaxCols === next.groupMaxCols &&
    prev.animationsEnabled === next.animationsEnabled &&
    prev.isSettingsOpen === next.isSettingsOpen
  );
});
