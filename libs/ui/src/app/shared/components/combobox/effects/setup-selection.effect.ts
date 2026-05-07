import { effect, untracked } from '@angular/core';
import { ComboboxOption } from '../combobox';
import { areOptionArraysEqualByValue, mapSelectedOptions } from '../combobox.multiple.helpers';

interface SelectionContext {
  multiple: () => boolean;
  internalValue: () => unknown;
  resolvedOptions: () => ComboboxOption[];
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

    if (selectedOption && Object.is(selectedOption.value, currentValue)) {
      return;
    }

    const matchedOption = context
      .resolvedOptions()
      .find((option) => Object.is(option.value, currentValue));

    if (!matchedOption) {
      if (currentValue == null || currentValue === '') {
        context.setSelectedOption(null);

        if (!context.isOpen()) {
          context.setInputValue('', true);
        }
      }

      return;
    }

    context.setSelectedOption(matchedOption);

    if (!context.isOpen()) {
      context.setInputValue(matchedOption.label, true);
    }
  });
}
