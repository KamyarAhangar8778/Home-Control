interface UseSegmentDensityProps {
  groupMaxCols: number;
  groupItemsCount: number;
  index: number;
  parentGroupsCols: number;
  isMobilePortrait: boolean;
}

export function useSegmentDensity({
  groupMaxCols,
  groupItemsCount,
  index,
  parentGroupsCols,
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
  
  const densityFactor = Math.max(1, rawDensityFactor);
  
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
