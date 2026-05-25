import { ValidatorFn } from '@angular/forms';
import { ComboboxOptions } from '../combobox';
import { SelectOptions } from '../select/config';

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
  options?: SelectOptions<any, any> | ComboboxOptions<any, any>;
  hint?: string;
  placeholder?: string;
  validators?: ValidatorFn | ValidatorFn[];
  multiple?: boolean;
  editing?: boolean;
  defaultValue?: any;
  templateValue?: string;
  value?: any;
  invalid?: boolean;
  loading?: boolean;
}

export interface InlineFilterConfig {
  fields: InlineFilterField[];
}
