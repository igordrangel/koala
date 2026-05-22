import { DestroyRef, WritableSignal } from '@angular/core';
import { InlineFilterField } from '../../../config';
import { onKeyUp } from './on-key-up';

export function handleAccessibility(
  selectedOptions: WritableSignal<InlineFilterField[]>,
  destroyRef: DestroyRef,
) {
  const onKeyUpHandler = onKeyUp(selectedOptions);

  document.addEventListener('keydown', onKeyUpHandler);

  destroyRef.onDestroy(() => {
    document.removeEventListener('keydown', onKeyUpHandler);
  });
}
