import { ComboboxOption } from '../combobox';

export function areOptionArraysEqualByValue(
  a: ComboboxOption[],
  b: ComboboxOption[],
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((option, index) => Object.is(option.value, b[index]?.value));
}
