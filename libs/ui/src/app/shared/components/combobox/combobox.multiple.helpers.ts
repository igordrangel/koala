import { ComboboxOption } from './combobox';

export function mapSelectedOptions(
  values: unknown[],
  options: ComboboxOption[],
  previous: ComboboxOption[],
): ComboboxOption[] {
  return values
    .map(
      (value) =>
        options.find((option) => Object.is(option.value, value)) ??
        previous.find((option) => Object.is(option.value, value)),
    )
    .filter((option): option is ComboboxOption => !!option);
}

export function toggleSelectedOption(
  current: ComboboxOption[],
  option: ComboboxOption,
): ComboboxOption[] {
  const isAlreadySelected = current.some((selected) => Object.is(selected.value, option.value));

  return isAlreadySelected
    ? current.filter((selected) => !Object.is(selected.value, option.value))
    : [...current, option];
}

export function removeSelectedOption(
  current: ComboboxOption[],
  optionValue: unknown,
): ComboboxOption[] {
  return current.filter((option) => !Object.is(option.value, optionValue));
}

export function selectedOptionsToValues(options: ComboboxOption[]): unknown[] {
  return options.map((selected) => selected.value);
}

export function isOptionSelected(options: ComboboxOption[], optionValue: unknown): boolean {
  return options.some((selected) => Object.is(selected.value, optionValue));
}

export function areOptionArraysEqualByValue(a: ComboboxOption[], b: ComboboxOption[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((option, index) => Object.is(option.value, b[index]?.value));
}
