import { computed } from '@angular/core';
import { KlDate } from '@koalarx/utils/light/KlDate';
import { ComboboxOption } from '../../combobox/combobox';
import {
  DEFAULT_FILTER_I18N,
  FilterBadgeSize,
  FilterBadgeStyle,
  FilterBadgeVariant,
  FilterCurrencyConfig,
  FilterDefinition,
  FilterI18n,
  FilterSize,
} from '../filter.models';
import {
  CHIP_SIZE,
  FIELD_SIZE,
  INPUT_MASK_BY_FIELD,
  INPUT_MODE_BY_FIELD,
  INPUT_TYPE_BY_FIELD,
} from './filter-entry.constants';
import {
  coerceFilterCurrencyValue,
  formatFilterCurrencyValue,
  getCurrencyDecimalDigitsAttr,
  resolveFilterPlaceholder,
} from './filter-entry.utils';

type Getter<T> = () => T;

export function createFilterEntryPresentation(config: {
  definition: Getter<FilterDefinition>;
  entryValue: Getter<unknown>;
  pendingText: Getter<string | null>;
  resolvedOptions: Getter<ComboboxOption[]>;
  getCachedSelectedLabel: (value: unknown) => string | null;
  isRemoteValueLoading: Getter<boolean>;
  i18n: Getter<FilterI18n | undefined>;
  size: Getter<FilterSize>;
  isInvalid: Getter<boolean>;
  isEditing: Getter<boolean>;
  currencyInputDisplay: Getter<string>;
  badgeVariant: Getter<FilterBadgeVariant>;
  badgeStyle: Getter<FilterBadgeStyle>;
  badgeSize: Getter<FilterBadgeSize>;
}) {
  const currencyConfig = computed<FilterCurrencyConfig>(() => config.definition().currency ?? {});
  const displayValue = computed<string | null>(() => {
    const value = config.entryValue();
    const type = config.definition().type;
    const options = config.resolvedOptions();

    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return null;
    }

    if (type === 'selectMultiple' && Array.isArray(value)) {
      return (
        value
          .map(
            (item) => options.find((option) => `${option.value}` === `${item}`)?.label ?? `${item}`,
          )
          .join(', ') || null
      );
    }

    if (type === 'select' || type === 'combobox') {
      const cachedLabel = config.getCachedSelectedLabel(value);
      if (cachedLabel) return cachedLabel;
      if (config.isRemoteValueLoading()) return null;
      return options.find((option) => `${option.value}` === `${value}`)?.label ?? `${value}`;
    }

    if (type === 'date' && typeof value === 'string') {
      try {
        return new KlDate(`${value}T00:00:00`).format('dd/MM/yyyy');
      } catch {
        return value;
      }
    }

    if (type === 'currency') {
      const numeric = coerceFilterCurrencyValue(value, currencyConfig());
      return numeric == null ? `${value}` : formatFilterCurrencyValue(numeric, currencyConfig());
    }

    return `${value}`;
  });

  const i18n = computed(() => config.i18n() ?? DEFAULT_FILTER_I18N);
  const entryTextValue = computed(() => {
    const pendingText = config.pendingText();
    if (pendingText !== null) {
      return pendingText;
    }
    const value = config.entryValue();
    return value == null ? '' : `${value}`;
  });
  const resolvedPlaceholder = computed(() => resolveFilterPlaceholder(config.definition(), i18n()));
  const inputType = computed(() => INPUT_TYPE_BY_FIELD[config.definition().type] ?? 'text');
  const inputMode = computed(() => INPUT_MODE_BY_FIELD[config.definition().type] ?? 'text');
  const inputMask = computed(() => INPUT_MASK_BY_FIELD[config.definition().type]);
  const currencyDecimalDigits = computed(() => getCurrencyDecimalDigitsAttr(currencyConfig()));
  const removeLabel = computed(() => i18n().removeLabel);

  const chipClass = computed(() => {
    const sizeClass = CHIP_SIZE[config.size()];
    if (config.isInvalid()) {
      return `inline-flex items-center rounded-full font-medium transition ${sizeClass} badge badge-error badge-soft h-auto border border-base-300`;
    }
    const badgeVariant = config.badgeVariant();
    const badgeStyle = config.badgeStyle();
    const badgeSize = config.badgeSize();
    return `inline-flex items-center rounded-full font-medium transition ${sizeClass} badge badge-${badgeVariant} badge-${badgeStyle} badge-${badgeSize} h-auto border border-base-300`;
  });

  const comboboxClass = computed(
    () =>
      `!inline-block !w-auto ${FIELD_SIZE[config.size()]} [&]:!inline-block [&]:!w-auto [&_div.group]:!h-auto [&_div.group]:!min-h-0 [&_div.group]:!w-auto [&_div.group]:!rounded-none [&_div.group]:!border-0 [&_div.group]:!bg-transparent [&_div.group]:!px-0 [&_div.group]:!shadow-none [&_div.group]:!ring-0 [&_div.group]:![font-size:inherit] [&_input]:!h-auto [&_input]:!w-auto [&_input]:!border-0 [&_input]:!bg-transparent [&_input]:!px-0 [&_input]:!py-0 [&_input]:!text-inherit [&_input]:![font-size:inherit] [&_input]:!shadow-none [&_input]:!outline-none`,
  );
  const fieldWidthCh = computed(() => {
    const base =
      (config.definition().type === 'currency' && config.isEditing()
        ? config.currencyInputDisplay().trim()
        : '') ||
      displayValue() ||
      entryTextValue() ||
      resolvedPlaceholder();

    return Math.max(7, (base || '').length);
  });
  const dateFieldWidthCh = computed(() => Math.max(10, fieldWidthCh()));

  return {
    chipClass,
    comboboxClass,
    currencyConfig,
    currencyDecimalDigits,
    dateFieldWidthCh,
    displayValue,
    entryTextValue,
    fieldWidthCh,
    inputMask,
    inputMode,
    inputType,
    removeLabel,
    resolvedPlaceholder,
  };
}
