import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import SortableGroup from "../../SortableGroup";
import SortableSegmentCard from "../../SortableSegmentCard";
import { IoTWorkspaceProps } from "../core/types";
import { getEffectiveGroupsCols } from "../core/gridUtils";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

type WorkspaceDragOverlayProps = Pick<
  IoTWorkspaceProps,
  | "activeSegmentId"
  | "activeGroupId"
  | "groupConfigs"
  
  | "isLoadingIoT"
  | "groupsCols"
  | "animationsEnabled"
  | "handleRemoveSegment"
  | "handleTogglePin"
  | "handleSetPinState"
  | "handleUpdateSegmentMode"
  | "handleUpdateSegmentAutoOff"
  | "handleUpdateSegmentRule"
  | "dashboardWidth"
>;

export default function WorkspaceDragOverlay({
  activeSegmentId,
  activeGroupId,
  groupConfigs,
  isLoadingIoT,
  groupsCols,
  animationsEnabled,
  handleRemoveSegment,
  handleTogglePin,
  handleSetPinState,
  handleUpdateSegmentMode,
  handleUpdateSegmentAutoOff,
  handleUpdateSegmentRule,
  dashboardWidth,
}: WorkspaceDragOverlayProps) {
  const isMobilePortrait = useMediaQuery("(max-width: 767px) and (orientation: portrait)");
  const segments = useIoTStore(s => s.segments);

  return (
    <DragOverlay>
      {activeSegmentId ? (
        (() => {
          const seg = segments.find(s => s.id === activeSegmentId);
          if (!seg) return null;
          const groupSegments = segments.filter(s => (s.group || "Test") === (seg.group || "Test"));
          const index = groupSegments.findIndex(s => s.id === activeSegmentId);
          const originalGroupCols = groupConfigs[seg.group || "Test"]?.maxCols || 3;
          
          const groupsOrder = Array.from(new Set(segments.map(s => s.group || "Test")));
          const groupIndex = groupsOrder.indexOf(seg.group || "Test");
          
          const effectiveGroupsCols = getEffectiveGroupsCols(
            groupIndex !== -1 ? groupIndex : 0, 
            groupsOrder.length, 
            groupsCols
          );

          return (
            <div style={{ opacity: 0.8, cursor: "grabbing" }}>
              <SortableSegmentCard
                segment={seg}
                
                onRemove={handleRemoveSegment}
                onTogglePin={handleTogglePin}
                onSetPinState={handleSetPinState}
                onUpdateSegmentMode={handleUpdateSegmentMode}
                onUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
                onUpdateSegmentRule={handleUpdateSegmentRule}
                isLoadingIoT={isLoadingIoT}
                parentGroupsCols={effectiveGroupsCols}
                groupMaxCols={originalGroupCols}
                groupItemsCount={groupSegments.length}
                index={index >= 0 ? index : 0}
                animationsEnabled={animationsEnabled}
                dashboardWidth={dashboardWidth}
                isMobilePortrait={isMobilePortrait}
              />
            </div>
          );
        })()
      ) : null}
      {activeGroupId ? (
        (() => {
          const groupId = activeGroupId.replace("group-", "");
          const groupSegments = segments.filter(s => (s.group || "Test") === groupId);
          
          const groupsOrder = Array.from(new Set(segments.map(s => s.group || "Test")));
          const groupIndex = groupsOrder.indexOf(groupId);
          
          const effectiveGroupsCols = getEffectiveGroupsCols(
            groupIndex !== -1 ? groupIndex : 0, 
            groupsOrder.length, 
            groupsCols
          );

          return (
            <div style={{ opacity: 0.8, cursor: "grabbing" }}>
              <SortableGroup 
                id={groupId} 
                items={groupSegments.map(s => s.id)} 
                segmentCount={groupSegments.length}
                maxCols={groupConfigs[groupId]?.maxCols || 3}
                icon={groupConfigs[groupId]?.icon}
                parentGroupsCols={groupsCols}
                onColsChange={() => {}}
                onAddPlaceholder={() => {}}
                onDeleteGroup={() => {}}
                animationsEnabled={animationsEnabled}
                isOverlayItem={true}
              >
                {groupSegments.map((seg, index) => (
                  <SortableSegmentCard
                    key={seg.id}
                    segment={seg}
                    
                    onRemove={handleRemoveSegment}
                    onTogglePin={handleTogglePin}
                    onSetPinState={handleSetPinState}
                    onUpdateSegmentMode={handleUpdateSegmentMode}
                    onUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
                    onUpdateSegmentRule={handleUpdateSegmentRule}
                    isLoadingIoT={isLoadingIoT}
                    parentGroupsCols={effectiveGroupsCols}
                    groupMaxCols={groupConfigs[groupId]?.maxCols || 3}
                    groupItemsCount={groupSegments.length}
                    index={index}
                    animationsEnabled={animationsEnabled}
                    isOverlayItem={true}
                    dashboardWidth={dashboardWidth}
                    isMobilePortrait={isMobilePortrait}
                  />
                ))}
              </SortableGroup>
            </div>
          );
        })()
      ) : null}
    </DragOverlay>
  );
}
