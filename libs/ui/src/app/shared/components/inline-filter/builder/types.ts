import { ValidatorFn } from '@angular/forms';
import { SelectOption } from '../../select/select';
import { ResourceRef } from '@angular/core';

export interface CommonOptions<TDefaultValue = any> {
  hint?: string;
  placeholder?: string;
  validators?: ValidatorFn | ValidatorFn[];
  defaultValue?: TDefaultValue;
}

export type InferSelectValue<T> = T extends readonly SelectOption<infer U, any>[]
  ? U
  : T extends ResourceRef<readonly SelectOption<infer U, any>[]>
    ? U
    : never;

export type SelectOptions = SelectOption<any, any>[] | ResourceRef<SelectOption<any, any>[]>;

export type SelectFieldConfig<
  T extends SelectOptions = SelectOptions,
  Multiple extends boolean = false,
> = CommonOptions<Multiple extends true ? InferSelectValue<T>[] : InferSelectValue<T>> & {
  multiple?: Multiple;
};
