import { ComboboxOption } from './combobox';
import { getNextActiveIndex } from './helpers';

type Getter<T> = () => T;

export function setupComboboxKeyboardHandling(config: {
  isOpen: Getter<boolean>;
  activeIndex: Getter<number>;
  resolvedOptions: Getter<ComboboxOption[]>;
  setIsOpen: (value: boolean) => void;
  setActiveIndex: (value: number) => void;
  selectOption: (option: ComboboxOption) => void;
  close: () => void;
}): (event: KeyboardEvent) => void {
  return function handleInputKeydown(event: KeyboardEvent) {
    const options = config.resolvedOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!config.isOpen()) {
          config.setIsOpen(true);
        }
        if (!options.length) {
          return;
        }
        config.setActiveIndex(getNextActiveIndex(config.activeIndex(), options.length, 'down'));
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!options.length) {
          return;
        }
        config.setActiveIndex(getNextActiveIndex(config.activeIndex(), options.length, 'up'));
        break;

      case 'Enter': {
        if (!config.isOpen()) {
          return;
        }
        const activeOption = options[config.activeIndex()] ?? null;
        if (!activeOption) {
          return;
        }
        event.preventDefault();
        config.selectOption(activeOption);
        break;
      }

      case 'Escape':
        if (!config.isOpen()) {
          return;
        }
        event.preventDefault();
        config.close();
        break;
    }
  };
}
