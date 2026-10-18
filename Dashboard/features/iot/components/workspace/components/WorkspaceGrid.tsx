import React, { useMemo } from "react";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroup from "../../SortableGroup";
import SortableSegmentCard from "../../SortableSegmentCard";
import { IoTWorkspaceProps } from "../core/types";
import { useWorkspaceGrid } from "../hooks/useWorkspaceGrid";
import { getEffectiveGroupsCols } from "../core/gridUtils";
import { useShallow } from "zustand/react/shallow";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

const ConnectedSegmentCard = React.memo((props: any) => {
  const segment = useIoTStore(React.useCallback((s) => s.segments.find((seg) => seg.id === props.segmentId), [props.segmentId]));
  if (!segment) return null;
  return <SortableSegmentCard segment={segment} {...props} />;
});

const ConnectedGroup = React.memo((props: any) => {
  const { groupName, groupIndex, groupConfigs, handleGroupColsChange, handleAddPlaceholder, handleRemoveGroup, animationsEnabled, isSegmentsCompactLayout, filteredGroupsOrderLength, groupsCols, isMobilePortrait, isGroupsCompactLayout, segmentProps } = props;

  const segmentIds = useIoTStore(
    useShallow((state) =>
      state.segments.filter((seg) => (seg.group || "Test") === groupName).map((seg) => seg.id)
    )
  );

  const effectiveGroupsCols = getEffectiveGroupsCols(
    groupIndex,
    filteredGroupsOrderLength,
    groupsCols
  );

  const flexBasis = (isMobilePortrait || groupsCols === 1) 
    ? FLEX_BASIS_LUT[1] 
    : FLEX_BASIS_LUT[groupsCols] || FLEX_BASIS_LUT[3];

  const baseClasses = isGroupsCompactLayout ? "space-y-3" : "flex-grow flex-shrink-0 min-w-0 max-w-full";
  const style = !isGroupsCompactLayout ? { flexBasis } : undefined;

  return (
    <div className={baseClasses} style={style}>
      <SortableGroup
        id={groupName}
        items={segmentIds}
        segmentCount={segmentIds.length}
        maxCols={groupConfigs[groupName]?.maxCols || 3}
        icon={groupConfigs[groupName]?.icon}
        onColsChange={(cols: number) => handleGroupColsChange(groupName, cols)}
        onAddPlaceholder={handleAddPlaceholder}
        onDeleteGroup={handleRemoveGroup}
        parentGroupsCols={effectiveGroupsCols}
        animationsEnabled={animationsEnabled}
        isSegmentsCompactLayout={isSegmentsCompactLayout}
      >
        {segmentIds.map((id: string, index: number) => (
          <ConnectedSegmentCard
            {...segmentProps}
            key={id}
            segmentId={id}
            index={index}
            groupItemsCount={segmentIds.length}
            parentGroupsCols={effectiveGroupsCols}
            groupMaxCols={groupConfigs[groupName]?.maxCols || 3}
            animationsEnabled={animationsEnabled}
            isMobilePortrait={isMobilePortrait}
          />
        ))}
      </SortableGroup>
    </div>
  );
});

const FLEX_BASIS_LUT: Record<number, string> = {
  1: "100%",
  2: "calc(50% - 1rem - 0.1px)",
  3: "calc(33.3333% - 1.3333rem - 0.1px)"
};

type WorkspaceGridProps = Omit<
  IoTWorkspaceProps,
  | "sensors"
  | "handleDragStart"
  | "handleDragOver"
  | "handleDragEnd"
  | "activeSegmentId"
  | "activeGroupId"
> & {
  selectedGroupFilter?: string | null;
};

export default function WorkspaceGrid({
  groupsOrder,
  groupsCols: initialGroupsCols,
  groupConfigs,
  isLoadingIoT,
  animationsEnabled,
  selectedGroupFilter,
  handleGroupColsChange,
  handleAddPlaceholder,
  handleRemoveGroup,
  handleRemoveSegment,
  handleTogglePin,
  handleSetPinState,
  handleUpdateSegmentMode,
  handleUpdateSegmentAutoOff,
  handleUpdateSegmentRule,
  handleSetupPlaceholder,
  isGroupsCompactLayout,
  isSegmentsCompactLayout,
  dashboardWidth = 1,
}: WorkspaceGridProps) {
  const {
    isMobilePortrait,
    filteredGroupsOrder,
    groupsCols,
    masonryGroups,
    lastRowGroup,
    columns,
  } = useWorkspaceGrid({
    groupsOrder,
    initialGroupsCols,
    selectedGroupFilter,
  });

  const renderGroup = (groupName: string, groupIndex: number) => {
    return (
      <ConnectedGroup
        key={groupName}
        groupName={groupName}
        groupIndex={groupIndex}
        groupConfigs={groupConfigs}
        handleGroupColsChange={handleGroupColsChange}
        handleAddPlaceholder={handleAddPlaceholder}
        handleRemoveGroup={handleRemoveGroup}
        animationsEnabled={animationsEnabled}
        isSegmentsCompactLayout={isSegmentsCompactLayout}
        filteredGroupsOrderLength={filteredGroupsOrder.length}
        groupsCols={groupsCols}
        isMobilePortrait={isMobilePortrait}
        isGroupsCompactLayout={isGroupsCompactLayout}
        segmentProps={{
          onRemove: handleRemoveSegment,
          onTogglePin: handleTogglePin,
          onSetPinState: handleSetPinState,
          onUpdateSegmentMode: handleUpdateSegmentMode,
          onUpdateSegmentAutoOff: handleUpdateSegmentAutoOff,
          onUpdateSegmentRule: handleUpdateSegmentRule,
          isLoadingIoT,
          onSetupPlaceholder: handleSetupPlaceholder,
          dashboardWidth,
        }}
      />
    );
  };

  return (
    <SortableContext
      items={filteredGroupsOrder.map((g) => `group-${g}`)}
      strategy={isMobilePortrait ? () => null : rectSortingStrategy}
    >
      {isGroupsCompactLayout ? (
        <div className="flex flex-col gap-8 w-full items-start">
          {masonryGroups.length > 0 && (
            <div className="flex gap-8 w-full items-start">
              {columns.map((colGroups, colIndex) => (
                colGroups.length > 0 ? (
                  <div key={`col-${colIndex}`} className="flex-1 flex flex-col gap-8 min-w-0">
                    {colGroups.map((groupName, rowIdx) => {
                      const groupIndex = rowIdx * groupsCols + colIndex;
                      return renderGroup(groupName, groupIndex);
                    })}
                  </div>
                ) : null
              ))}
            </div>
          )}
          {lastRowGroup && (
            <div className="w-full">
              {renderGroup(lastRowGroup, filteredGroupsOrder.length - 1)}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 w-full items-start">
          {filteredGroupsOrder.map((groupName, groupIndex) => renderGroup(groupName, groupIndex))}
        </div>
      )}
    </SortableContext>
  );
}
