import type { ComboboxOption } from './combobox';

export function asArrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function isEmptyValue(value: unknown): boolean {
  return value == null || value === '';
}

export function findOptionByValue(
  options: ComboboxOption[],
  value: unknown,
): ComboboxOption | null {
  return options.find((option) => Object.is(option.value, value)) ?? null;
}

export function getRestoredInputValue(
  multiple: boolean,
  selectedOption: ComboboxOption | null,
): string {
  return multiple ? '' : (selectedOption?.label ?? '');
}

export function hasLabelInSelectedOptions(options: ComboboxOption[], label: string): boolean {
  return options.some((option) => option.label === label);
}
