interface UseSegmentDensityProps {
  groupMaxCols: number;
  groupItemsCount: number;
  index: number;
  parentGroupsCols: number;
  dashboardWidth?: number;
  isMobilePortrait: boolean;
}

export function useSegmentDensity({
  groupMaxCols,
  groupItemsCount,
  index,
  parentGroupsCols,
  dashboardWidth = 1,
  isMobilePortrait,
}: UseSegmentDensityProps) {
  const effectiveGroupCols = Math.min(groupMaxCols, groupItemsCount);

  let rowOccupiedCols = effectiveGroupCols;
  if (effectiveGroupCols > 1 && groupItemsCount > 0) {
    const totalRows = Math.ceil(groupItemsCount / effectiveGroupCols);
    const currentRow = Math.floor(index / effectiveGroupCols);
    const isLastRow = currentRow === totalRows - 1;

    if (isLastRow) {
      const itemsInLastRow = groupItemsCount % effectiveGroupCols || effectiveGroupCols;
      rowOccupiedCols = itemsInLastRow;
    }
  }

  const effectiveParentCols = isMobilePortrait ? 1 : parentGroupsCols;
  const rawDensityFactor = rowOccupiedCols * effectiveParentCols;
  
  const widthReductionFactor = isMobilePortrait ? 0 : (dashboardWidth - 1) * 1.5;
  const densityFactor = Math.max(1, rawDensityFactor - widthReductionFactor);
  
  const isMobileTwoCol = isMobilePortrait && rowOccupiedCols >= 2;
  const isUltraCompact = densityFactor >= 6;
  const isCompact = (densityFactor >= 3 && densityFactor < 6) || isMobileTwoCol;

  return {
    densityFactor,
    isUltraCompact,
    isCompact,
    isMobileTwoCol,
  };
}
