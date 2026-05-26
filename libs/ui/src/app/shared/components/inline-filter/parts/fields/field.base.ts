import { isMobile } from '@/shared/utils/is-mobile';
import { Directive, effect, input, model, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { InlineFilterField } from '../../config';

@Directive()
export abstract class FieldBase {
  readonly config = input.required<InlineFilterField>();
  readonly isMobile = isMobile();

  readonly templateValue = model<any>('');
  readonly value = model<any>(null);
  readonly valueControl = new FormControl();
  readonly valueChanges = toSignal(this.valueControl.valueChanges, {
    initialValue: this.valueControl.value,
  });

  readonly isInvalid = output<boolean>();
  readonly data = output<any>();

  constructor() {
    effect(() => {
      this.config().templateValue = this.templateValue();
    });

    effect(() => {
      this.valueControl.setValue(this.value());
    });

    effect(() => {
      const config = this.config();

      if (config.validators) {
        this.valueControl.setValidators(config.validators);
      }

      this.templateValue.set(config.templateValue);
      this.value.set(config.value);
    });

    effect(() => {
      const isInvalid = this.valueControl.invalid;
      const value = this.valueChanges();

      this.config().invalid = isInvalid;
      this.config().value = isInvalid ? null : value;
      this.isInvalid.emit(isInvalid);
    });
  }
}
