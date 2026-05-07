import { mapItemsByValues } from '../../../utils/map-items-by-values';
import { ComboboxOption } from '../combobox';

export function mapSelectedOptions(
  values: unknown[],
  options: ComboboxOption[],
  previous: ComboboxOption[],
): ComboboxOption[] {
  return mapItemsByValues(values, options, previous);
}
