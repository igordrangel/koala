export function hasItemWithValue<TItem extends { value: unknown }>(
  items: TItem[],
  value: unknown,
): boolean {
  return items.some((item) => Object.is(item.value, value));
}
