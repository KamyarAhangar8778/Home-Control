import React from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
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
      className="relative h-full"
    >
      <Card
        className={\`group relative flex h-full flex-col justify-between border border-[var(--border-color)] border-r-2 transition-[border-color,box-shadow] duration-200 hover:shadow-lg \${
          isPinOn ? "border-r-[var(--success)] shadow-[0_0_0_1px_var(--success)]" : "border-r-transparent"
        } \${isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"}\`}
        style={{ "--card-spacing": "0px" } as React.CSSProperties}
      >
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
      </Card>
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
