export function asArrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
