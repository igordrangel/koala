import { ComboboxOption } from '../combobox';

export function findOptionByValue(
  options: ComboboxOption[],
  value: unknown,
): ComboboxOption | null {
  return options.find((option) => Object.is(option.value, value)) ?? null;
}
