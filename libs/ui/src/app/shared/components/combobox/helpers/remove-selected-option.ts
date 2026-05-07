import { ComboboxOption } from '../combobox';

export function removeSelectedOption(
  current: ComboboxOption[],
  optionValue: unknown,
): ComboboxOption[] {
  return current.filter((option) => !Object.is(option.value, optionValue));
}
