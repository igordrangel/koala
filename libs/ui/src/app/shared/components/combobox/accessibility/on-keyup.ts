import { Signal } from '@angular/core';

export function onKeyUp(
  optionsElement: HTMLDivElement,
  filter: Signal<string>,
  removeLastSelected: () => void,
) {
  return (event: KeyboardEvent) => {
    const focusedOption: HTMLElement = optionsElement.querySelector('li[data-active="true"]')!;

    switch (event.key) {
      case 'Enter':
        if (focusedOption) {
          focusedOption.click();
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        const previousOption: HTMLLIElement | null = focusedOption
          ? (focusedOption.previousElementSibling as HTMLLIElement)
          : optionsElement.querySelector('li')!;

        if (previousOption) {
          optionsElement
            .querySelectorAll('li')
            .forEach((option) => (option.dataset['active'] = 'false'));

          previousOption.dataset['active'] = 'true';
          previousOption.scrollIntoView({ block: 'nearest' });
          event.preventDefault();
        }
        break;
      case 'ArrowDown':
        const nextOption: HTMLLIElement | null = focusedOption
          ? (focusedOption.nextElementSibling as HTMLLIElement)
          : optionsElement.querySelector('li')!;

        if (nextOption) {
          optionsElement
            .querySelectorAll('li')
            .forEach((option) => (option.dataset['active'] = 'false'));

          nextOption.dataset['active'] = 'true';
          nextOption.scrollIntoView({ block: 'nearest' });
          event.preventDefault();
        }
        break;
      case 'Backspace':
      default:
        if (event.key === 'Backspace' && !filter().length) {
          removeLastSelected();
          event.preventDefault();
        }

        const firstOption: HTMLElement | null = optionsElement.querySelector('li');

        if (firstOption) {
          firstOption.dataset['active'] = 'true';
          firstOption.scrollIntoView({ block: 'nearest' });
        }
        break;
    }
  };
}
