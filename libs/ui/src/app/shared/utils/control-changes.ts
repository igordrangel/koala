import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/internal/operators/filter';

export function controlChanges<T extends FormControl>(control: T) {
  return toSignal<T['value']>(control.valueChanges.pipe(filter(() => control.valid)), {
    initialValue: control.value,
  });
}
