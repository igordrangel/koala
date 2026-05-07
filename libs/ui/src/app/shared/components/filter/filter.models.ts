import { Signal } from '@angular/core';
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
  /** Default placeholder for select/combobox fields */
  selectPlaceholder: string;
}

export const DEFAULT_FILTER_I18N: FilterI18n = {
  placeholder: 'Filter by...',
  emptyLabel: 'empty',
  closeLabel: 'Close',
  removeLabel: 'Remove filter',
  allFiltersAdded: 'All available filter types have been added.',
  selectPlaceholder: 'Select',
};

// ─── Definition ───────────────────────────────────────────────────────────────
export interface FilterDefinition {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
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
