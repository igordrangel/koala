import { removeItemByValue } from '../../../utils/remove-item-by-value';
import { ComboboxOption } from '../combobox';

export function removeSelectedOption(
  current: ComboboxOption[],
  optionValue: unknown,
): ComboboxOption[] {
  return removeItemByValue(current, optionValue);
}
