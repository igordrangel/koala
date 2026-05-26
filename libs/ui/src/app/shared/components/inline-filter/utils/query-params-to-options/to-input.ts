import { maskCoin } from '@koalarx/utils/KlNumber';
import { InlineFilterField } from '../../config';
import { coerceValue } from './coerce-value';

export function toInput(option: InlineFilterField, value: string) {
  const templateValue = coerceValue(value);

  if (option.inputType === 'currency' && typeof templateValue === 'number') {
    option.templateValue = maskCoin(templateValue);
    return;
  }

  option.templateValue = value;
}
