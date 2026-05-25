import { DestroyRef } from '@angular/core';
import { onClick } from './on-click';
import { onKeyUp } from './on-keyup';

export function handleAccessibility(
  triggerElement: HTMLElement,
  optionsElement: HTMLDivElement,
  destroyRef: DestroyRef,
) {
  const onKeyDownHandler = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        break;
    }
  };
  const onKeyUpHandler = onKeyUp(optionsElement);
  const onClickTriggerHandler = onClick(optionsElement);

  window.addEventListener('keydown', onKeyDownHandler);
  triggerElement.addEventListener('keyup', onKeyUpHandler);
  triggerElement.addEventListener('click', onClickTriggerHandler);

  destroyRef.onDestroy(() => {
    window.removeEventListener('keydown', onKeyDownHandler);
    triggerElement.removeEventListener('keyup', onKeyUpHandler);
    triggerElement.removeEventListener('click', onClickTriggerHandler);
  });
}
