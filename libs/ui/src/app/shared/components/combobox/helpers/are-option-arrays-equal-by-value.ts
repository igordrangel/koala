import { areItemsEqualByValue } from '../../../utils/are-items-equal-by-value';
import { ComboboxOption } from '../combobox';

export function areOptionArraysEqualByValue(a: ComboboxOption[], b: ComboboxOption[]): boolean {
  return areItemsEqualByValue(a, b);
}
