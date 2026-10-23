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
import { useMasonryGrid } from "../hooks/useMasonryGrid";

const GROUP_ITEM_BASIS_LUT: Record<number, string> = {
  1: "100%",
  2: "calc(50% - 0.5rem - 0.1px)",
  3: "calc(33.3333% - 0.6667rem - 0.1px)"
};

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
  isSegmentsCompactLayout,
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

  const childrenArray = React.Children.toArray(children);
  const { effectiveCols, masonryChildren, lastRowChild, columns } = useMasonryGrid(
    childrenArray,
    maxCols,
    isSegmentsCompactLayout
  );

  const renderContent = () => {
    if (isSegmentsCompactLayout) {
      return (
        <div className="flex flex-col gap-4 w-full text-right p-4 relative z-10">
          {masonryChildren.length > 0 && (
            <div className="flex gap-4 w-full">
              {columns.map((colChildren) => (
                colChildren.length > 0 ? (
                  <div key={`col-${colChildren.map((child) => React.isValidElement(child) ? child.key : null).join("-")}`} className="flex-1 flex flex-col gap-4 min-w-0">
                    <AnimatePresence mode="popLayout">{colChildren}</AnimatePresence>
                  </div>
                ) : null
              ))}
            </div>
          )}
          {lastRowChild && (
            <div className="w-full">
              <AnimatePresence mode="popLayout">{lastRowChild}</AnimatePresence>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className="flex flex-wrap gap-4 w-full text-right p-4 relative z-10 [&>*]:grow [&>*]:shrink-0 [&>*]:min-w-0 [&>*]:basis-[var(--group-item-basis)]"
        style={{
          "--group-item-basis": GROUP_ITEM_BASIS_LUT[effectiveCols] || GROUP_ITEM_BASIS_LUT[3]
        } as React.CSSProperties}
      >
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </div>
    );
  };

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
