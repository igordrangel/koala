import { ResourceRef } from '@angular/core';
import { SelectOption } from '../../select/select';
import { BuilderBase } from './builder.base';

export class SelectBuilder extends BuilderBase {
  options(options: SelectOption[] | ResourceRef<SelectOption[]>) {
    this.config.type = 'select';
    this.config.options = options;
    return this;
  }
}
