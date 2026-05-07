import { ComboboxOption } from '../combobox';

export function selectedOptionsToValues(options: ComboboxOption[]): unknown[] {
  return options.map((selected) => selected.value);
}
