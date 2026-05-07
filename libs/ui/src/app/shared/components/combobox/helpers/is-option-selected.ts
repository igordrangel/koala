import { hasItemWithValue } from '../../../utils/has-item-with-value';
import { ComboboxOption } from '../combobox';

export function isOptionSelected(options: ComboboxOption[], optionValue: unknown): boolean {
  return hasItemWithValue(options, optionValue);
}
