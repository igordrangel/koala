export function mapItemsByValues<TItem extends { value: unknown }>(
  values: unknown[],
  items: TItem[],
  previous: TItem[],
): TItem[] {
  return values
    .map(
      (value) =>
        items.find((item) => Object.is(item.value, value)) ??
        previous.find((item) => Object.is(item.value, value)),
    )
    .filter((item): item is TItem => !!item);
}
