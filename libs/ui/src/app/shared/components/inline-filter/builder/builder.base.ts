import { ValidatorFn } from '@angular/forms';
import { InlineFilterField, InlineFilterFieldType } from '../config';

export abstract class BuilderBase {
  protected config = {} as InlineFilterField;

  constructor(label: string, name: string, validators?: ValidatorFn | ValidatorFn[]) {
    this.config.label = label;
    this.config.name = name;
    this.config.validators = validators;
  }

  type(type: InlineFilterFieldType) {
    this.config.type = type;
    return this;
  }

  hint(hint?: string) {
    this.config.hint = hint;
    return this;
  }

  defaultValue(value?: any) {
    this.config.defaultValue = value;
    return this;
  }

  build() {
    return this.config;
  }
}
