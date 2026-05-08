import { Signal } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Resource, ResourceRef } from '@angular/core';
import { ComboboxOption } from '../combobox/combobox';

// ─── Field types ──────────────────────────────────────────────────────────────
export type FilterFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'url'
  | 'cpf'
  | 'cnpj'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'month'
  | 'time'
  | 'select'
  | 'selectMultiple'
  | 'combobox';

// ─── Size & Variant ───────────────────────────────────────────────────────────
export type FilterSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type FilterVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

// ─── Remote options via Angular Resource ──────────────────────────────────────
export type FilterOptionsResource =
  | Resource<ComboboxOption[] | undefined>
  | ResourceRef<ComboboxOption[] | undefined>;

/**
 * Receives a reactive signal with the current selected values so the resource
 * can pre-load labels for hydrated (value-only) entries from storage.
 * When used by combobox fields, the current typed filter is also provided.
 */
export type FilterOptionsResourceFactory = (
  values: Signal<unknown[]>,
  filter?: Signal<string>,
) => FilterOptionsResource;

export interface FilterCurrencyConfig {
  prefix?: string;
  decimalDigits?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
}

// ─── I18n ────────────────────────────────────────────────────────────────────
export interface FilterI18n {
  /** Placeholder shown inside the picker input */
  placeholder: string;
  /** Label shown inside the chip when the field has no value yet */
  emptyLabel: string;
  /** Close button label inside the edit popover */
  closeLabel: string;
  /** aria-label for the remove (×) button */
  removeLabel: string;
  /** Footer note shown when all filter types have been added */
  allFiltersAdded: string;
  /** Default placeholder for input fields */
  inputPlaceholder: string;
  /** Default placeholder for select/combobox fields */
  selectPlaceholder: string;
  /** Labels used by the keyboard shortcuts helper popover */
  shortcuts?: Partial<FilterShortcutsI18n>;
}

export interface FilterShortcutsI18n {
  title: string;
  buttonLabel: string;
  buttonTooltip: string;
  applyValue: string;
  cancelOrRemove: string;
  editNearestChip: string;
  removeLastChip: string;
  selectType: string;
  arrowLeftAriaLabel: string;
}

export const DEFAULT_FILTER_SHORTCUTS_I18N: FilterShortcutsI18n = {
  title: 'Keyboard shortcuts',
  buttonLabel: 'Open keyboard shortcuts',
  buttonTooltip: 'Keyboard shortcut tips',
  applyValue: 'Apply value in edit mode',
  cancelOrRemove: 'Cancel edit (or remove empty filter)',
  editNearestChip: 'Edit nearest chip from picker (empty input)',
  removeLastChip: 'Remove last chip from picker (empty input)',
  selectType: 'Select type in picker list',
  arrowLeftAriaLabel: 'ArrowLeft',
};

export const DEFAULT_FILTER_I18N: FilterI18n = {
  placeholder: 'Filter by...',
  emptyLabel: 'empty',
  closeLabel: 'Close',
  removeLabel: 'Remove filter',
  allFiltersAdded: 'All available filter types have been added.',
  inputPlaceholder: 'Fill in value',
  selectPlaceholder: 'Select',
  shortcuts: DEFAULT_FILTER_SHORTCUTS_I18N,
};

// ─── Definition ───────────────────────────────────────────────────────────────
export interface FilterDefinition {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  /** Optional currency mask/format options used by `currency` fields */
  currency?: FilterCurrencyConfig;
  /** Static option list (select, selectMultiple, combobox) */
  options?: ComboboxOption[];
  /**
   * Factory that creates an Angular resource (resource / httpResource / rxResource).
   * Use this instead of static options for remote data.
   */
  resourceFactory?: FilterOptionsResourceFactory;
  /** Allow the same filter key to appear more than once */
  allowMultiple?: boolean;
  /** Badge colour variant — overrides the global filter variant */
  variant?: FilterVariant;
  /** Synchronous validators — chip shows error styling when invalid */
  validators?: ValidatorFn | ValidatorFn[];
  /** Asynchronous validators — chip shows error styling when invalid */
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
}

// ─── Internal state ───────────────────────────────────────────────────────────
export interface FilterEntry {
  id: string;
  key: string;
  value: unknown;
}

// ─── Output value ─────────────────────────────────────────────────────────────
export interface FilterValue {
  key: string;
  label: string;
  type: FilterFieldType;
  value: unknown;
}
