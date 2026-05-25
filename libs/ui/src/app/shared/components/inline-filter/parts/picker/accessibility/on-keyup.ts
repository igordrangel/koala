export function onKeyUp(
  optionsElement: HTMLDivElement,
  openOptions: () => boolean,
  editLastOption: () => void,
) {
  return (event: KeyboardEvent) => {
    const focusedOption: HTMLElement = optionsElement.querySelector('li[data-active="true"]')!;

    switch (event.key) {
      case 'ArrowLeft': {
        editLastOption();
        event.preventDefault();
        break;
      }
      case 'Enter':
        if (focusedOption) {
          focusedOption.click();
          event.preventDefault();
        }
        break;
      case 'ArrowUp': {
        let previousOption: HTMLLIElement = focusedOption?.previousElementSibling as HTMLLIElement;

        if (!previousOption) {
          const optionList = optionsElement.querySelectorAll('li');
          previousOption = optionList.item(optionList.length - 1) as HTMLLIElement;
        }

        optionsElement
          .querySelectorAll('li')
          .forEach((option) => (option.dataset['active'] = 'false'));

        previousOption.dataset['active'] = 'true';
        previousOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        const alreadyVisible = openOptions();

        let nextOption: HTMLLIElement | null = alreadyVisible
          ? (focusedOption?.nextElementSibling as HTMLLIElement)
          : null;

        if (!nextOption) {
          nextOption = optionsElement.querySelector('li')!;
        }

        optionsElement
          .querySelectorAll('li')
          .forEach((option) => (option.dataset['active'] = 'false'));

        nextOption.dataset['active'] = 'true';
        nextOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        event.preventDefault();
        break;
      }
      default: {
        const firstOption: HTMLElement | null = optionsElement.querySelector('li');

        if (firstOption) {
          firstOption.dataset['active'] = 'true';
          firstOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        break;
      }
    }
  };
}
