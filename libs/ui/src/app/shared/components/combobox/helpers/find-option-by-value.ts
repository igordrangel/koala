import { findItemByValue } from '../../../utils/find-item-by-value';
import { ComboboxOption } from '../combobox';

export function findOptionByValue(
  options: ComboboxOption[],
  value: unknown,
): ComboboxOption | null {
  return findItemByValue(options, value);
}
