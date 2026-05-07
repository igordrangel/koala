export function togglePrimitiveValue(values: unknown[], value: unknown): unknown[] {
  return values.some((item) => Object.is(item, value))
    ? values.filter((item) => !Object.is(item, value))
    : [...values, value];
}
