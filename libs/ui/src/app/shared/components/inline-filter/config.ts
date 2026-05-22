import { SelectOption } from '@/shared/components/select/select';
import { ResourceRef } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ComboboxOptions } from '../combobox';

export type InlineFilterFieldType = 'input' | 'calendar' | 'select' | 'combobox';
export type InlineFilterInputType =
  | 'text'
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'cpf'
  | 'cnpj'
  | 'currency';

export interface InlineFilterField {
  label: string;
  name: string;
  type: InlineFilterFieldType;
  inputType?: InlineFilterInputType;
  options?:
    | SelectOption<any, any>[]
    | ResourceRef<SelectOption<any, any>[]>
    | ComboboxOptions<any, any>;
  hint?: string;
  placeholder?: string;
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
  editing?: boolean;
  templateValue?: string;
}

export interface InlineFilterConfig {
  fields: InlineFilterField[];
}
