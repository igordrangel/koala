import { ComboboxOption } from '../combobox';

export function getRestoredInputValue(
  multiple: boolean,
  selectedOption: ComboboxOption | null,
): string {
  return multiple ? '' : (selectedOption?.label ?? '');
}
