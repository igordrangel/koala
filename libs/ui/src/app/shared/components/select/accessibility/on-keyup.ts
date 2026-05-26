import { scrollIntoView } from '@/shared/utils/scroll-into-view';

export function onKeyUp(optionsElement: HTMLDivElement) {
  return (event: KeyboardEvent) => {
    const focusedOption: HTMLElement = optionsElement.querySelector('li[data-active="true"]')!;

    switch (event.key) {
      case 'Enter':
        const isOpened = focusedOption?.parentElement?.classList.contains('opened') ?? false;

        if (focusedOption && isOpened) {
          focusedOption.click();
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        let previousOption: HTMLLIElement = focusedOption?.previousElementSibling as HTMLLIElement;

        if (!previousOption) {
          const optionList = optionsElement.querySelectorAll('li');
          previousOption = optionList.item(optionList.length - 1) as HTMLLIElement;
        }

        optionsElement
          .querySelectorAll('li')
          .forEach((option) => (option.dataset['active'] = 'false'));

        previousOption.dataset['active'] = 'true';
        scrollIntoView(previousOption);
        event.preventDefault();
        break;
      case 'ArrowDown':
        let nextOption: HTMLLIElement = focusedOption?.nextElementSibling as HTMLLIElement;

        if (!nextOption) {
          nextOption = optionsElement.querySelector('li')!;
        }

        optionsElement
          .querySelectorAll('li')
          .forEach((option) => (option.dataset['active'] = 'false'));

        nextOption.dataset['active'] = 'true';
        scrollIntoView(nextOption);
        event.preventDefault();
        break;
      default:
        const firstOption: HTMLElement | null = optionsElement.querySelector('li');

        if (firstOption) {
          firstOption.dataset['active'] = 'true';
          scrollIntoView(firstOption);
        }
        break;
    }
  };
}
