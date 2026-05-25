import { scrollIntoView } from '@/shared/utils/scroll-into-view';

export function onClick(optionsElement: HTMLDivElement | HTMLElement) {
  return () => {
    const focusedOption: HTMLElement | null =
      optionsElement.querySelector('li[data-active="true"]');
    const selectedOptions = optionsElement.querySelectorAll('li[data-selected="true"]');

    if (focusedOption) {
      scrollIntoView(focusedOption);
    } else if (selectedOptions.length > 0) {
      const lastSelectedOption =
        selectedOptions[selectedOptions.length - 1]?.getAttribute('data-value');

      const selectedOption: HTMLElement | null = lastSelectedOption
        ? optionsElement.querySelector(`li[data-value="${lastSelectedOption}"]`)
        : null;

      if (selectedOption) {
        scrollIntoView(selectedOption);
        selectedOption.dataset['active'] = 'true';
      }
    } else {
      const firstOption: HTMLElement | null = optionsElement.querySelector('li');

      if (firstOption) {
        scrollIntoView(firstOption);
        firstOption.dataset['active'] = 'true';
      }
    }
  };
}
