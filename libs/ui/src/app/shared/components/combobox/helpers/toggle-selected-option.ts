import { toggleItemByValue } from '../../../utils/toggle-item-by-value';
import { ComboboxOption } from '../combobox';

export function toggleSelectedOption(
  current: ComboboxOption[],
  option: ComboboxOption,
): ComboboxOption[] {
  return toggleItemByValue(current, option);
}
