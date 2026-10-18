import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useMemo } from "react";

interface UseWorkspaceGridProps {
  groupsOrder: string[];
  initialGroupsCols: number;
  selectedGroupFilter?: string | null;
}

export function useWorkspaceGrid({
  groupsOrder,
  initialGroupsCols,
  selectedGroupFilter,
}: UseWorkspaceGridProps) {
  const isMobilePortrait = useMediaQuery("(max-width: 767px) and (orientation: portrait)");

  return useMemo(() => {
    const filteredGroupsOrder = selectedGroupFilter
      ? groupsOrder.filter((g) => g === selectedGroupFilter)
      : groupsOrder;

    const groupsCols = isMobilePortrait ? 1 : selectedGroupFilter ? 1 : initialGroupsCols;

    const itemsInLastRow = filteredGroupsOrder.length % groupsCols;
    const hasSingleItemInLastRow = itemsInLastRow === 1;

    const masonryGroups = hasSingleItemInLastRow
      ? filteredGroupsOrder.slice(0, -1)
      : filteredGroupsOrder;

    const lastRowGroup = hasSingleItemInLastRow
      ? filteredGroupsOrder[filteredGroupsOrder.length - 1]
      : null;

    // Distribute items into columns to create a masonry effect while maintaining left-to-right order
    const columns: string[][] = Array.from({ length: groupsCols }, () => []);
    masonryGroups.forEach((groupName, index) => {
      columns[index % groupsCols].push(groupName);
    });

    return {
      isMobilePortrait,
      filteredGroupsOrder,
      groupsCols,
      masonryGroups,
      lastRowGroup,
      columns,
    };
  }, [groupsOrder, initialGroupsCols, selectedGroupFilter, isMobilePortrait]);
}
