import React from "react";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroup from "../../SortableGroup";
import SortableSegmentCard from "../../SortableSegmentCard";
import type { IoTWorkspaceProps } from "../core/types";
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
  const { groupName, groupIndex, groupConfigs, handleGroupColsChange, handleAddPlaceholder, handleRemoveGroup, animationsEnabled, filteredGroupsOrderLength, groupsCols, isMobilePortrait, segmentProps } = props;

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

  const baseClasses = "flex-grow flex-shrink-0 min-w-0 max-w-full";
  const style = { flexBasis };

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
}: WorkspaceGridProps) {
  const {
    isMobilePortrait,
    filteredGroupsOrder,
    groupsCols,
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
        filteredGroupsOrderLength={filteredGroupsOrder.length}
        groupsCols={groupsCols}
        isMobilePortrait={isMobilePortrait}
        segmentProps={{
          onRemove: handleRemoveSegment,
          onTogglePin: handleTogglePin,
          onSetPinState: handleSetPinState,
          onUpdateSegmentMode: handleUpdateSegmentMode,
          onUpdateSegmentAutoOff: handleUpdateSegmentAutoOff,
          onUpdateSegmentRule: handleUpdateSegmentRule,
          isLoadingIoT,
          onSetupPlaceholder: handleSetupPlaceholder,
        }}
      />
    );
  };

  return (
    <SortableContext
      items={filteredGroupsOrder.map((g) => `group-${g}`)}
      strategy={isMobilePortrait ? () => null : rectSortingStrategy}
    >
      <div className="flex flex-wrap gap-8 w-full items-start">
        {filteredGroupsOrder.map((groupName, groupIndex) => renderGroup(groupName, groupIndex))}
      </div>
    </SortableContext>
  );
}
