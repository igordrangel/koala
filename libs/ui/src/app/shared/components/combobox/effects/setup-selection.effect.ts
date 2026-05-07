import { effect, untracked } from '@angular/core';
import { ComboboxOption } from '../combobox';
import { isSameComboboxValue, areOptionArraysEqualByValue, mapSelectedOptions } from '../helpers';

interface SelectionContext {
  multiple: () => boolean;
  internalValue: () => unknown;
  resolvedOptions: () => ComboboxOption[];
  inputValue: () => string;
  selectedOptions: () => ComboboxOption[];
  selectedOption: () => ComboboxOption | null;
  isOpen: () => boolean;
  setSelectedOptions: (value: ComboboxOption[]) => void;
  setSelectedOption: (value: ComboboxOption | null) => void;
  setInputValue: (value: string, resetFilter?: boolean) => void;
}

export function setupSelectionEffect(context: SelectionContext) {
  effect(() => {
    if (context.multiple()) {
      const internalValue = context.internalValue();
      const currentValues: unknown[] = Array.isArray(internalValue) ? internalValue : [];
      const options = context.resolvedOptions();
      const previous = untracked(() => context.selectedOptions());

      const mapped = mapSelectedOptions(currentValues, options, previous);

      if (!areOptionArraysEqualByValue(previous, mapped)) {
        context.setSelectedOptions(mapped);
      }

      if (untracked(() => context.selectedOption()) !== null) {
        context.setSelectedOption(null);
      }

      if (!context.isOpen()) {
        context.setInputValue('', true);
      }

      return;
    }

    const currentValue = context.internalValue();
    const selectedOption = context.selectedOption();
    const options = context.resolvedOptions();

    if (selectedOption && isSameComboboxValue(selectedOption.value, currentValue)) {
      return;
    }

    const matchedOption = options.find((option) => isSameComboboxValue(option.value, currentValue));

    if (matchedOption) {
      context.setSelectedOption(matchedOption);

      if (!context.isOpen() || context.inputValue().trim() === '') {
        context.setInputValue(matchedOption.label, true);
      }
      return;
    }

    if (currentValue != null && currentValue !== '') {
      return;
    }

    context.setSelectedOption(null);

    if (!context.isOpen()) {
      context.setInputValue('', true);
    }
  });
}
