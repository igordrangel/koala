import { Signal, WritableSignal } from '@angular/core';
import { InlineFilterField } from '../../../config';

export function onKeyUp(
  selectedOptions: WritableSignal<InlineFilterField[]>,
  filter: Signal<string>,
) {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        setTimeout(() => {
          selectedOptions.update((current) => {
            return current.map((item) => {
              if (!item.multiple && !item.invalid) {
                item.editing = false;
              }
              return item;
            });
          });
        }, 100);
        break;
      }
      case 'Tab': {
        setTimeout(() => {
          selectedOptions.update((current) => {
            return current.map((item) => {
              if (!item.invalid) {
                item.editing = false;
              }
              return item;
            });
          });
        }, 100);
        break;
      }
      case 'Escape': {
        selectedOptions.update((current) => {
          return current
            .filter((item) => !item.editing || (item.editing && item.value))
            .map((item) => {
              item.editing = false;
              return item;
            });
        });
        break;
      }
      case 'Backspace': {
        const hasEditing = selectedOptions().some((item) => item.editing);

        if (!hasEditing && !filter()) {
          selectedOptions.update((current) => {
            current = current.slice(0, -1);
            return [...current];
          });
        }
        break;
      }
      case 'ArrowLeft': {
        const hasEditing = selectedOptions().some((item) => item.editing);

        if (!hasEditing && !filter()) {
          selectedOptions.update((current) => {
            const lastIndex = current.length - 1;

            if (lastIndex >= 0) {
              current[lastIndex].editing = true;
            }

            return [...current];
          });
        }
        break;
      }
      default:
        break;
    }
  };
}
