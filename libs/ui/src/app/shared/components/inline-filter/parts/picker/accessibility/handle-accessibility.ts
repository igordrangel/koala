import { DestroyRef, Signal, WritableSignal } from '@angular/core';
import { InlineFilterField } from '../../../config';
import { onKeyUp } from './on-key-up';

export function handleAccessibility(
  selectedOptions: WritableSignal<InlineFilterField[]>,
  filter: Signal<string>,
  destroyRef: DestroyRef,
) {
  const onKeyUpHandler = onKeyUp(selectedOptions, filter);

  document.addEventListener('keydown', onKeyUpHandler);

  destroyRef.onDestroy(() => {
    document.removeEventListener('keydown', onKeyUpHandler);
  });
}
