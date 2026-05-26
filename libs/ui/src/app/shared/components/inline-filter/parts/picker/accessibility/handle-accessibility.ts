import { DestroyRef, Signal } from '@angular/core';
import { onKeyDown } from './on-keydown';
import { onKeyUp } from './on-keyup';

export function handleAccessibility(
  inputElement: HTMLInputElement,
  optionsElement: HTMLDivElement,
  openOptions: () => boolean,
  editLastOption: () => void,
  removeLastOption: () => void,
  filter: Signal<string>,
  destroyRef: DestroyRef,
) {
  const onKeyUpHandler = onKeyUp(optionsElement, openOptions, editLastOption);
  const onKeyDownHandler = onKeyDown(filter, removeLastOption);

  inputElement.addEventListener('keyup', onKeyUpHandler);
  inputElement.addEventListener('keydown', onKeyDownHandler);

  destroyRef.onDestroy(() => {
    inputElement.removeEventListener('keyup', onKeyUpHandler);
    inputElement.removeEventListener('keydown', onKeyDownHandler);
  });
}
