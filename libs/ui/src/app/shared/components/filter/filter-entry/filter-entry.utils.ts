import { FormControl } from '@angular/forms';
import { maskCoin } from '@koalarx/utils/KlNumber';
import { unmaskCoin } from '@koalarx/utils/KlString';
import { FilterCurrencyConfig, FilterDefinition, FilterI18n } from '../filter.models';

function resolveCurrencyDecimalDigits(config: FilterCurrencyConfig): number {
  if (config.decimalDigits == null) {
    return 2;
  }

  return Math.max(0, Math.trunc(Number(config.decimalDigits)));
}

export function getCurrencyDecimalDigitsAttr(config: FilterCurrencyConfig): string | undefined {
  if (config.decimalDigits == null) {
    return undefined;
  }

  return `${resolveCurrencyDecimalDigits(config)}`;
}

export function formatFilterCurrencyValue(value: number, config: FilterCurrencyConfig): string {
  return maskCoin(value, {
    prefix: config.prefix ?? 'R$',
    thousands: config.thousandSeparator ?? '.',
    decimal: config.decimalSeparator ?? ',',
    decimalCount: resolveCurrencyDecimalDigits(config),
  });
}

export function coerceFilterCurrencyValue(
  value: unknown,
  config: FilterCurrencyConfig,
): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber)) {
    return asNumber;
  }

  const parsed = unmaskCoin(trimmed, resolveCurrencyDecimalDigits(config));
  return Number.isFinite(parsed) ? parsed : null;
}

export function resolveFilterPlaceholder(definition: FilterDefinition, i18n: FilterI18n): string {
  if (definition.placeholder) {
    return definition.placeholder;
  }

  switch (definition.type) {
    case 'cpf':
      return '000.000.000-00';
    case 'cnpj':
      return 'SS.SSS.SSS/SSSS-SS';
    case 'currency':
      return '0,00';
    case 'date':
      return 'dd/MM/yyyy';
    case 'datetime':
      return 'dd/MM/yyyy HH:mm';
    case 'month':
      return 'MM/yyyy';
    case 'email':
      return 'example@example.com';
    case 'number':
      return '0';
    case 'time':
      return 'HH:mm';
    case 'url':
      return 'https://example.com';
    case 'text':
      return i18n.inputPlaceholder || 'Fill in value';
    default:
      return i18n.selectPlaceholder || 'Select';
  }
}

export function syncValidationControlWithDefinition(
  control: FormControl<unknown>,
  definition: FilterDefinition,
) {
  control.setValidators(definition.validators ?? null);
  control.setAsyncValidators(definition.asyncValidators ?? null);
}

export function isValidationControlInvalid(control: FormControl<unknown>): boolean {
  return control.touched && (control.invalid || control.pending);
}

export function validateControlCandidate(control: FormControl<unknown>, value: unknown): boolean {
  control.setValue(value, { emitEvent: false });
  control.markAsTouched();
  control.updateValueAndValidity();
  return control.valid;
}

export function hasCommittedFilterValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && `${value}`.trim() !== '';
}
