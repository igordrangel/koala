export function isSameComboboxValue(left: unknown, right: unknown): boolean {
  return Object.is(left, right) || `${left}` === `${right}`;
}
