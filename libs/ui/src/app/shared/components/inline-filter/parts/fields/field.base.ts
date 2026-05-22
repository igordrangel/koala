import { Directive, effect, input, model, output } from '@angular/core';
import { InlineFilterField } from '../../config';

@Directive()
export abstract class FieldBase {
  readonly config = input.required<InlineFilterField>();
  readonly data = output<any>();

  readonly value = model<any>('');

  constructor() {
    effect(() => {
      this.config().templateValue = this.value();
    });
  }
}
