/**
 * Calculates the effective number of columns a group should span
 * based on its position in the grid and the total number of items,
 * preventing orphaned items on the last row.
 *
 * @param groupIndex The index of the group in the filtered list
 * @param totalGroups The total number of groups being rendered
 * @param maxCols The maximum number of columns the grid supports
 * @returns The effective number of columns the group should occupy
 */
export function getEffectiveGroupsCols(
  groupIndex: number,
  totalGroups: number,
  maxCols: number
): number {
  let actualParentGroupsCols = maxCols;

  if (maxCols > 1 && totalGroups > 0) {
    const totalRows = Math.ceil(totalGroups / maxCols);
    const currentRow = Math.floor(groupIndex / maxCols);
    const isLastRow = currentRow === totalRows - 1;

    if (isLastRow) {
      const itemsInLastRow = totalGroups % maxCols || maxCols;
      actualParentGroupsCols = itemsInLastRow;
    }
  }

  return Math.min(totalGroups, actualParentGroupsCols);
}
