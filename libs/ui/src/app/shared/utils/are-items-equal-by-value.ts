export function areItemsEqualByValue<TItem extends { value: unknown }>(
  left: TItem[],
  right: TItem[],
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((item, index) => Object.is(item.value, right[index]?.value));
}
