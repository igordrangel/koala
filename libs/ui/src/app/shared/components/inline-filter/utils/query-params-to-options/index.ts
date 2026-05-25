import { Injector, WritableSignal } from '@angular/core';
import { InlineFilterField } from '../../config';
import { toCalendar } from './to-calendar';
import { toCombobox } from './to-combobox';
import { toInput } from './to-input';
import { toSelect } from './to-select';
import { validateOption } from './validate-options';

export function queryParamsToOptions(
  config: InlineFilterField[],
  selectedOptions: WritableSignal<InlineFilterField[]>,
  queryParams: Record<string, string>,
  injector: Injector,
) {
  const queryProps = { ...queryParams };

  for (const field of config) {
    if (queryProps[field.name]) {
      continue;
    }

    if (field.defaultValue) {
      queryProps[field.name] = field.defaultValue;
    }
  }

  const options = Object.entries(queryProps)
    .map(([key, value]) => {
      const fieldConfig = config.find((field) => field.name === key);

      if (!fieldConfig) {
        return null;
      }

      if (!validateOption(fieldConfig, value)) {
        return null;
      }

      const option = { ...fieldConfig, value };

      switch (fieldConfig.type) {
        case 'input': {
          toInput(option, value);
          break;
        }
        case 'calendar': {
          toCalendar(option, value);
          break;
        }
        case 'combobox': {
          toCombobox(option, value, selectedOptions, injector);
          break;
        }
        case 'select': {
          toSelect(option, value, selectedOptions, injector);
          break;
        }
      }

      return option;
    })
    .filter((option) => option !== null);

  selectedOptions.set(options as InlineFilterField[]);
}
