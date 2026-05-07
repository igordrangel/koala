import { ComboboxOption } from '../combobox';

export function hasLabelInSelectedOptions(
  options: ComboboxOption[],
  label: string,
): boolean {
  return options.some((option) => option.label === label);
}
