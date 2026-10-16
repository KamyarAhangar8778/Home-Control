"use client";

import { useState, useCallback } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export function useAchaemenidDnd({
  handleRemoveGroup,
  handleRemoveSegment,
}: {
  handleRemoveGroup: (groupId: string) => void;
  handleRemoveSegment: (id: string) => void;
}) {
  const setSegments = useIoTStore((state) => state.setSegments);
  const setGroupsOrder = useIoTStore((state) => state.setGroupsOrder);

  const activeSegmentId = useIoTStore((state) => state.activeSegmentId);
  const activeGroupId = useIoTStore((state) => state.activeGroupId);
  const setActiveSegmentId = useIoTStore((state) => state.setActiveSegmentId);
  const setActiveGroupId = useIoTStore((state) => state.setActiveGroupId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    if (e.active.data.current?.type === "Group") setActiveGroupId(e.active.id as string);
    else setActiveSegmentId(e.active.id as string);
  }, []);

  const handleDragOver = useCallback((e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || active.data.current?.type === "Group" || over.data.current?.type === "Group")
      return;

    const segments = useIoTStore.getState().segments;
    const activeSeg = segments.find((s) => s.id === active.id);
    if (!activeSeg) return;
    const overSeg = segments.find((s) => s.id === over.id);

    if (overSeg) {
      const activeGroup = activeSeg.group || "Test";
      const overGroup = overSeg.group || "Test";
      setSegments((prev) => {
        const activeIdx = prev.findIndex((s) => s.id === active.id);
        const overIdx = prev.findIndex((s) => s.id === over.id);
        if (activeIdx === -1 || overIdx === -1) return prev;
        if (activeGroup !== overGroup) {
          return prev;
        }
        return activeIdx !== overIdx ? arrayMove(prev, activeIdx, overIdx) : prev;
      });
    } else {
      const groupsOrder = useIoTStore.getState().groupsOrder;
      const overIdStr = over.id.toString();
      const targetGroup = overIdStr.startsWith("group-")
        ? overIdStr.replace("group-", "")
        : groupsOrder.includes(overIdStr)
          ? overIdStr
          : "";
      if (targetGroup && (activeSeg.group || "Test") !== targetGroup) {
        // Do nothing to prevent cross-group dragging
      }
    }
  }, [setSegments]);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveSegmentId(null);
    setActiveGroupId(null);
    const { active, over } = e;
    if (!over) return;
    if (over.id === "trash-dropzone") {
      if (active.data.current?.type === "Group")
        handleRemoveGroup(active.id.toString().replace("group-", ""));
      else if (active.data.current?.type === "Segment") handleRemoveSegment(active.id.toString());
      return;
    }
    if (active.data.current?.type === "Group") {
      const activeIdStr = active.id.toString().replace("group-", "");
      const overIdStr = over.id.toString().replace("group-", "");
      if (activeIdStr !== overIdStr) {
        setGroupsOrder((prev) => {
          const activeIdx = prev.indexOf(activeIdStr);
          const overIdx = prev.indexOf(overIdStr);
          return activeIdx !== -1 && overIdx !== -1 ? arrayMove(prev, activeIdx, overIdx) : prev;
        });
      }
    }
  }, [handleRemoveGroup, handleRemoveSegment, setGroupsOrder]);

  return {
    sensors,
    activeSegmentId,
    activeGroupId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
