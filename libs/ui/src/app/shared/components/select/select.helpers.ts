import type { SelectBadgeVariant, SelectOption, SelectSize } from './select';
import { findItemByValue } from '../../utils/find-item-by-value';
import { togglePrimitiveValue } from '../../utils/toggle-primitive-value';

const CHECK_ICON_CLASS_BY_VARIANT: Record<SelectBadgeVariant, string> = {
  neutral: 'text-neutral',
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
};

const SIZE_CLASS_BY_VARIANT: Record<SelectSize, string> = {
  xs: 'min-h-6 text-xs px-2',
  sm: 'min-h-8 text-sm px-2.5',
  md: 'min-h-10 text-sm px-3',
  lg: 'min-h-12 text-base px-3.5',
  xl: 'min-h-14 text-lg px-4',
};

export function getSelectCheckIconClass(variant: SelectBadgeVariant): string {
  return CHECK_ICON_CLASS_BY_VARIANT[variant];
}

export function getSelectSizeClass(size: SelectSize): string {
  return SIZE_CLASS_BY_VARIANT[size];
}

export function getOptionLabel(options: SelectOption[], value: unknown, fallback: string): string {
  return findItemByValue(options, value)?.label ?? fallback;
}

export function getTriggerLabel(
  selectedValues: unknown[],
  options: SelectOption[],
  placeholder: string,
): string {
  if (selectedValues.length === 0) {
    return placeholder;
  }

  if (selectedValues.length > 1) {
    return placeholder;
  }

  return getOptionLabel(options, selectedValues[0], placeholder);
}

export function toggleSelectValue(current: unknown[], value: unknown): unknown[] {
  return togglePrimitiveValue(current, value);
}
