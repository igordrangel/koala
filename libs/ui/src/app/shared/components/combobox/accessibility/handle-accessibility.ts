import { DestroyRef, Signal } from '@angular/core';
import { onClick } from './on-click';
import { onKeyUp } from './on-keyup';

export function handleAccessibility(
  inputElement: HTMLInputElement,
  optionsElement: HTMLDivElement,
  selectedElement: HTMLElement,
  filter: Signal<string>,
  removeLastSelected: () => void,
  destroyRef: DestroyRef,
) {
  const onKeyUpHandler = onKeyUp(optionsElement, filter, removeLastSelected);
  const onClickTriggerHandler = onClick(optionsElement, 'trigger');
  const onClickSelectedHandler = onClick(optionsElement, 'selected');

  inputElement.addEventListener('keyup', onKeyUpHandler);
  inputElement.addEventListener('click', onClickTriggerHandler);
  selectedElement.addEventListener('click', onClickSelectedHandler);

  destroyRef.onDestroy(() => {
    inputElement.removeEventListener('keyup', onKeyUpHandler);
    inputElement.removeEventListener('click', onClickTriggerHandler);
    selectedElement.removeEventListener('click', onClickSelectedHandler);
  });
}
