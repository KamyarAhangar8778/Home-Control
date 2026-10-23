"use client";

import { DndContext } from "@dnd-kit/core";
import TrashDropZone from "./workspace/components/TrashDropZone";
import { WorkspaceGrid, WorkspaceDragOverlay } from "./workspace";
import type { IoTWorkspaceProps } from "./workspace";
import { optimizedCollisionDetection } from "./workspace/core/collisionStrategy";

export type { IoTWorkspaceProps };

export default function IoTWorkspace(props: IoTWorkspaceProps) {
  return (
    <DndContext sensors={props.sensors} collisionDetection={optimizedCollisionDetection} autoScroll={{ layoutShiftCompensation: false }} onDragStart={props.handleDragStart} onDragOver={props.handleDragOver} onDragEnd={props.handleDragEnd}>
      <WorkspaceGrid {...props} />
      <WorkspaceDragOverlay {...props} />
      <TrashDropZone activeId={props.activeSegmentId || props.activeGroupId} />
      {(props.activeSegmentId || props.activeGroupId) && <style>{"* { cursor: grabbing !important; }"}</style>}
    </DndContext>
  );
}
