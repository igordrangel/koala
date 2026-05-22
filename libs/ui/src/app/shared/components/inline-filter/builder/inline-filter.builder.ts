import { Injectable, ResourceRef } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { SelectOption } from '../../select/select';
import { InlineFilterConfig, InlineFilterInputType } from '../config';
import { CalendarBuilder } from './calendar.builder';
import { ComboboxBuilder } from './combobox.builder';
import { InputBuilder } from './input.builder';
import { SelectBuilder } from './select.builder';
import { ComboboxOptions } from '../../combobox';

interface CommonOptions {
  hint?: string;
  placeholder?: string;
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
}

@Injectable({ providedIn: 'root' })
export class InlineFilterBuilder {
  private readonly config = {
    fields: [],
  } as InlineFilterConfig;

  input(
    label: string,
    name: string,
    type: InlineFilterInputType = 'text',
    fieldOptions?: CommonOptions,
  ) {
    this.config.fields.push(
      new InputBuilder(label, name, fieldOptions?.validators, fieldOptions?.asyncValidators)
        .type(type)
        .placeholder(fieldOptions?.placeholder)
        .hint(fieldOptions?.hint)
        .build(),
    );

    return this;
  }

  select(
    label: string,
    name: string,
    options: SelectOption<any, any>[] | ResourceRef<SelectOption<any, any>[]>,
    fieldOptions?: CommonOptions,
  ) {
    this.config.fields.push(
      new SelectBuilder(label, name, fieldOptions?.validators, fieldOptions?.asyncValidators)
        .options(options)
        .hint(fieldOptions?.hint)
        .build(),
    );

    return this;
  }

  combobox(
    label: string,
    name: string,
    options: ComboboxOptions<any, any>,
    fieldOptions?: CommonOptions,
  ) {
    this.config.fields.push(
      new ComboboxBuilder(label, name, fieldOptions?.validators, fieldOptions?.asyncValidators)
        .options(options)
        .hint(fieldOptions?.hint)
        .build(),
    );

    return this;
  }

  calendar(label: string, name: string, fieldOptions?: CommonOptions) {
    this.config.fields.push(
      new CalendarBuilder(label, name, fieldOptions?.validators, fieldOptions?.asyncValidators)
        .hint(fieldOptions?.hint)
        .build(),
    );

    return this;
  }

  build() {
    return this.config;
  }
}
