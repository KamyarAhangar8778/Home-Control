import React from "react";

export interface SortableGroupProps {
  id: string; // Group Name
  items: string[]; // Segment IDs
  segmentCount: number;
  maxCols: number;
  onColsChange: (cols: number) => void;
  onAddPlaceholder: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  parentGroupsCols?: number;
  animationsEnabled?: boolean;
  icon?: string;
  children: React.ReactNode;
  isOverlayItem?: boolean;
  isSegmentsCompactLayout?: boolean;
}
