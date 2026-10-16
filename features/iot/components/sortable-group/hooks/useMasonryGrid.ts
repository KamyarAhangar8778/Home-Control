import React, { useMemo } from "react";

export function useMasonryGrid(
  childrenArray: React.ReactNode[],
  maxCols: number,
  isSegmentsCompactLayout?: boolean
) {
  return useMemo(() => {
    const itemsCount = childrenArray.length;
    const effectiveCols = Math.min(Math.max(1, itemsCount), maxCols);

    const itemsInLastRow = itemsCount % effectiveCols;
    const hasSingleItemInLastRow = itemsInLastRow === 1;

    const masonryChildren = hasSingleItemInLastRow ? childrenArray.slice(0, -1) : childrenArray;
    const lastRowChild = hasSingleItemInLastRow ? childrenArray[itemsCount - 1] : null;

    const columns: React.ReactNode[][] = Array.from({ length: effectiveCols }, () => []);
    
    if (isSegmentsCompactLayout) {
      masonryChildren.forEach((child, index) => {
        columns[index % effectiveCols].push(child);
      });
    }

    return {
      effectiveCols,
      masonryChildren,
      lastRowChild,
      columns,
    };
  }, [childrenArray, maxCols, isSegmentsCompactLayout]);
}
