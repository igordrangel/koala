import { WritableSignal } from '@angular/core';
import { InlineFilterField } from '../../../config';

export function onKeyUp(selectedOptions: WritableSignal<InlineFilterField[]>) {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        selectedOptions.update((current) => {
          return current.map((item) => {
            item.editing = false;
            return item;
          });
        });
        break;
      }
      case 'Escape':
      case 'Backspace': {
        selectedOptions.update((current) => {
          return current.filter((item) => !item.editing);
        });
        break;
      }
      default:
        break;
    }
  };
}
