export function getPreviousIndex(
  item: any,
  addRemoveOffset: number,
  moveOffsets: number[] | null
): number {

  const previousIndex = item.previousIndex;

  if (previousIndex === null) return previousIndex;

  let moveOffset = 0;

  if (moveOffsets && previousIndex < moveOffsets.length) {
    moveOffset = moveOffsets[previousIndex];
  }

  return previousIndex + addRemoveOffset + moveOffset;
}
