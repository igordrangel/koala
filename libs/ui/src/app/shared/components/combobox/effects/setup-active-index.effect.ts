import { effect } from '@angular/core';
import { ComboboxOption } from '../combobox';
import { getInitialActiveIndex } from '../combobox.navigation.helpers';

interface ActiveIndexContext {
  isOpen: () => boolean;
  resolvedOptions: () => ComboboxOption[];
  selectedOption: () => ComboboxOption | null;
  setActiveIndex: (index: number) => void;
}

export function setupActiveIndexEffect(context: ActiveIndexContext) {
  effect(() => {
    if (!context.isOpen()) {
      context.setActiveIndex(-1);
      return;
    }

    const options = context.resolvedOptions();
    if (!options.length) {
      context.setActiveIndex(-1);
      return;
    }

    const selectedIndex = options.findIndex((option) =>
      Object.is(option.value, context.selectedOption()?.value),
    );

    context.setActiveIndex(getInitialActiveIndex(options.length, selectedIndex));
  });
}
