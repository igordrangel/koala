export function findItemByValue<TItem extends { value: unknown }>(
  items: TItem[],
  value: unknown,
): TItem | null {
  return items.find((item) => Object.is(item.value, value)) ?? null;
}
