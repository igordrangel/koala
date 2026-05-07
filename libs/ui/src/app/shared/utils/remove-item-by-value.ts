export function removeItemByValue<TItem extends { value: unknown }>(
  items: TItem[],
  value: unknown,
): TItem[] {
  return items.filter((item) => !Object.is(item.value, value));
}
