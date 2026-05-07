import { ComboboxOption } from '../combobox';

export function mapSelectedOptions(
  values: unknown[],
  options: ComboboxOption[],
  previous: ComboboxOption[],
): ComboboxOption[] {
  return values
    .map(
      (value) =>
        options.find((option) => Object.is(option.value, value)) ??
        previous.find((option) => Object.is(option.value, value)),
    )
    .filter((option): option is ComboboxOption => !!option);
}
