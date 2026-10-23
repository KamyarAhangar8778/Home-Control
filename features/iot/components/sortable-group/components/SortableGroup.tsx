"use client";

import React from "react";
import {
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { SortableGroupProps } from "../core/types";
import GroupHeader from "./GroupHeader";

export default function SortableGroup({
  id,
  items,
  segmentCount,
  maxCols,
  onColsChange,
  onAddPlaceholder,
  onDeleteGroup,
  parentGroupsCols = 1,
  animationsEnabled = true,
  icon,
  children,
  isOverlayItem,
}: SortableGroupProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `group-${id}`,
    data: {
      type: "Group",
      group: id,
    },
    disabled: isOverlayItem,
  });

  const style = {
    transform: CSS.Transform.toString(isDragging ? null : transform),
    transition: animationsEnabled
      ? transition || "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
      : "none",
    zIndex: isDragging ? 0 : "auto",
    opacity: isDragging ? 0.3 : 1,
  };

  const effectiveCols = Math.min(Math.max(1, items.length), maxCols);

  const renderContent = () => (
    <div
      className="grid w-full min-w-0 grid-cols-1 gap-3 p-3 text-right relative z-10 sm:grid-cols-[repeat(var(--group-cols),minmax(0,1fr))] sm:gap-4 sm:p-4"
      style={{ "--group-cols": effectiveCols } as React.CSSProperties}
    >
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/group-card w-full mb-6 touch-none flex flex-col gap-2"
    >
      <GroupHeader
        id={id}
        segmentCount={segmentCount}
        maxCols={maxCols}
        icon={icon}
        onColsChange={onColsChange}
        onAddPlaceholder={onAddPlaceholder}
        onDeleteGroup={onDeleteGroup}
        parentGroupsCols={parentGroupsCols}
        attributes={attributes}
        listeners={listeners}
      />

      {/* Body Island */}
      <Card className="w-full relative group/body flex-grow !gap-0 !overflow-visible !rounded-2xl !border !border-[var(--border-color)] !bg-[var(--card-bg)] !py-0 !shadow-sm !ring-0 backdrop-blur-md">
        <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-350 md:group-hover/group-card:opacity-100 pointer-events-none" />
        <CardContent className="!px-0 !py-0">
          {isOverlayItem ? (
            renderContent()
          ) : (
            <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
              {renderContent()}
            </SortableContext>
          )}
        </CardContent>
      </Card>

      {/* Footer Island */}
      <div className="flex justify-center mt-2 w-full">
        <Card className="relative z-10 w-fit !gap-0 !overflow-visible !rounded-2xl !border !border-[var(--border-color)] !bg-[var(--card-bg)] !p-2 !shadow-sm !ring-0 backdrop-blur-md">
          <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-350 md:group-hover/group-card:opacity-100 pointer-events-none" />
          <CardContent className="!px-2 !py-0">
            <div className="flex gap-1.5 opacity-50 transition-opacity md:group-hover/group-card:opacity-100 relative z-10">
              {Array.from({ length: maxCols }, (_, index) => index + 1).map((column) => (
                <div key={`column-${column}`} className="w-2.5 h-1.5 bg-[var(--accent3)] rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
