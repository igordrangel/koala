import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { InlineFilterField } from '../config';

export abstract class BuilderBase {
  protected config = {} as InlineFilterField;

  constructor(
    label: string,
    name: string,
    validators?: ValidatorFn | ValidatorFn[],
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[],
  ) {
    this.config.label = label;
    this.config.name = name;
    this.config.validators = validators;
    this.config.asyncValidators = asyncValidators;
  }

  hint(hint?: string) {
    this.config.hint = hint;
    return this;
  }

  build() {
    return this.config;
  }
}
