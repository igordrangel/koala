import { Injector, ResourceRef, WritableSignal } from '@angular/core';
import { InlineFilterField } from '../../config';
import { SelectOption } from '@/shared/components/select/select';
import { toObservable } from '@angular/core/rxjs-interop';
import { first } from 'rxjs/internal/operators/first';
import { joinOptionLabels } from './join-option-labels';
import { filterOptionsByValue } from './filter-options-by-value';
import { delay } from 'rxjs/internal/operators/delay';
import { asyncSetTemplateValue } from './async-set-template-value';
import { asyncNotFoundTemplateValue } from './async-not-found-template-value';

export function toSelect(
  option: InlineFilterField,
  value: string,
  selectedOptions: WritableSignal<InlineFilterField[]>,
  injector: Injector,
) {
  if (Array.isArray(option.options)) {
    option.templateValue = joinOptionLabels(filterOptionsByValue(option.options, value));
  } else {
    const optionsResource = option.options as ResourceRef<SelectOption<any, any>[]>;

    option.loading = true;

    toObservable(optionsResource.value, { injector })
      .pipe(delay(50), first())
      .subscribe({
        next: (options) => asyncSetTemplateValue(selectedOptions, options, option, value),
        error: () => asyncNotFoundTemplateValue(selectedOptions, option),
      });
  }
}
