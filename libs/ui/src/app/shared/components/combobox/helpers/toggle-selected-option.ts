import { ComboboxOption } from '../combobox';

export function toggleSelectedOption(
  current: ComboboxOption[],
  option: ComboboxOption,
): ComboboxOption[] {
  const isAlreadySelected = current.some((selected) => Object.is(selected.value, option.value));

  return isAlreadySelected
    ? current.filter((selected) => !Object.is(selected.value, option.value))
    : [...current, option];
}
