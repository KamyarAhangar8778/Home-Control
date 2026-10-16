"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableSegmentCardProps } from "../core/types";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useSegmentDensity } from "../hooks/useSegmentDensity";
import PlaceholderCard from "./PlaceholderCard";
import ActiveCard from "./ActiveCard";

function SortableSegmentCard(props: SortableSegmentCardProps) {
  const {
    segment,
    parentGroupsCols = 1,
    groupMaxCols = 3,
    groupItemsCount = 1,
    index = 0,
    animationsEnabled = true,
  } = props;
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const isPinOn = useIoTStore(s => !!s.pinsState[segment.pin]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: segment.id,
    data: {
      type: "Segment",
      group: segment.group || "Test",
    },
    disabled: props.isOverlayItem,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: animationsEnabled
      ? transition || "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
      : "none",
    zIndex: isDragging ? 50 : isSettingsOpen ? 40 : "auto",
    opacity: isDragging ? 0.35 : 1,
    scale: isDragging ? 0.96 : 1,
  };

  const { densityFactor, isUltraCompact, isCompact, isMobileTwoCol } = useSegmentDensity({
    groupMaxCols,
    groupItemsCount,
    index,
    parentGroupsCols,
    dashboardWidth: props.dashboardWidth,
    isMobilePortrait: props.isMobilePortrait || false,
  });

  if (props.isOverlayItem) {
    return (
      <div className="relative h-full">
        <ActiveCard
          {...props}
          isCompact={isCompact}
          isUltraCompact={isUltraCompact}
          isMobileTwoCol={isMobileTwoCol}
          densityFactor={densityFactor}
          attributes={{}}
          listeners={{}}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`touch-none relative h-full ${isSettingsOpen ? "!basis-full !max-w-full" : ""}`}
      >
        <div
          className={`w-full border-2 border-dashed border-[var(--accent3-medium)]/35 bg-[var(--card-bg)]/20 backdrop-blur-md rounded-2xl transition-all duration-300 ${
            isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"
          } flex items-center justify-center`}
        >
          <div className="w-5 h-5 rounded-full border-2 border-[var(--accent3-medium)]/20 border-t-[var(--accent3)] animate-spin opacity-40" />
        </div>
      </div>
    );
  }

  if (segment.type === "placeholder") {
    return (
      <div ref={setNodeRef} style={style} className="touch-none relative">
        <PlaceholderCard
          segment={segment}
          onRemove={props.onRemove}
          onSetupPlaceholder={props.onSetupPlaceholder}
          attributes={attributes}
          listeners={listeners}
          isCompact={isCompact}
          isUltraCompact={isUltraCompact}
          animationsEnabled={animationsEnabled}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`touch-none relative h-full transition-all duration-300 ${isSettingsOpen ? "z-40" : ""}`}
    >
      <ActiveCard
        {...props}
        isCompact={isCompact}
        isUltraCompact={isUltraCompact}
        isMobileTwoCol={isMobileTwoCol}
        densityFactor={densityFactor}
        attributes={attributes}
        listeners={listeners}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
    </div>
  );
}

export default React.memo(SortableSegmentCard, (prevProps, nextProps) => {
  return (
    prevProps.segment === nextProps.segment &&
    prevProps.isLoadingIoT === nextProps.isLoadingIoT &&
    prevProps.parentGroupsCols === nextProps.parentGroupsCols &&
    prevProps.groupMaxCols === nextProps.groupMaxCols &&
    prevProps.groupItemsCount === nextProps.groupItemsCount &&
    prevProps.index === nextProps.index &&
    prevProps.animationsEnabled === nextProps.animationsEnabled &&
    prevProps.isOverlayItem === nextProps.isOverlayItem &&
    prevProps.isMobilePortrait === nextProps.isMobilePortrait
  );
});
