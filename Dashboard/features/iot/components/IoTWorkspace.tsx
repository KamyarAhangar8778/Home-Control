"use client";

import React from "react";
import { DndContext } from "@dnd-kit/core";
import TrashDropZone from "./workspace/components/TrashDropZone";
import { WorkspaceGrid, WorkspaceDragOverlay, IoTWorkspaceProps } from "./workspace";
import { optimizedCollisionDetection } from "./workspace/core/collisionStrategy";

export type { IoTWorkspaceProps };

export default function IoTWorkspace(props: IoTWorkspaceProps) {
  return (
    <DndContext
      sensors={props.sensors}
      collisionDetection={optimizedCollisionDetection}
      autoScroll={{ layoutShiftCompensation: false }}
      onDragStart={props.handleDragStart}
      onDragOver={props.handleDragOver}
      onDragEnd={props.handleDragEnd}
    >
      <WorkspaceGrid {...props} />
      <WorkspaceDragOverlay {...props} />
      <TrashDropZone activeId={props.activeSegmentId || props.activeGroupId} />

      {/* Force grabbing cursor globally during drag to prevent underlying elements from overriding it */}
      {(props.activeSegmentId || props.activeGroupId) && (
        <style dangerouslySetInnerHTML={{ __html: `* { cursor: grabbing !important; }` }} />
      )}
    </DndContext>
  );
}
