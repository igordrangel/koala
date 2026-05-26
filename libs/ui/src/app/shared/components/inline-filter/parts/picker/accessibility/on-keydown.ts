import { Signal } from '@angular/core';

export function onKeyDown(filter: Signal<string>, removeLastOption: () => void) {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Backspace': {
        if (event.key === 'Backspace' && !filter().length) {
          removeLastOption();
          event.preventDefault();
        }
        break;
      }
    }
  };
}
