export function toggleItemByValue<TItem extends { value: unknown }>(
  items: TItem[],
  item: TItem,
): TItem[] {
  const hasItem = items.some((current) => Object.is(current.value, item.value));

  return hasItem
    ? items.filter((current) => !Object.is(current.value, item.value))
    : [...items, item];
}
