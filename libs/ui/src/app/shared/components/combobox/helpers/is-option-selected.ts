import { ComboboxOption } from '../combobox';

export function isOptionSelected(options: ComboboxOption[], optionValue: unknown): boolean {
  return options.some((selected) => Object.is(selected.value, optionValue));
}
