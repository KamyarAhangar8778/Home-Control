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

    return {
      isMobilePortrait,
      filteredGroupsOrder,
      groupsCols,
    };
  }, [groupsOrder, initialGroupsCols, selectedGroupFilter, isMobilePortrait]);
}
