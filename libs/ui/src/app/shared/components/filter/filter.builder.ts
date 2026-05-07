import { ComboboxOption } from '../combobox/combobox';
import {
  FilterDefinition,
  FilterFieldType,
  FilterOptionsResourceFactory,
  FilterVariant,
} from './filter.models';

class FilterDefBuilder {
  private _config: Partial<FilterDefinition>;

  key: string;
  label: string;
  type: FilterFieldType;

  constructor(key: string, label: string, type: FilterFieldType) {
    this.key = key;
    this.label = label;
    this.type = type;
    this._config = {};
  }

  placeholder(value: string): this {
    this._config.placeholder = value;
    return this;
  }

  variant(value: FilterVariant): this {
    this._config.variant = value;
    return this;
  }

  allowMultiple(value: boolean = true): this {
    this._config.allowMultiple = value;
    return this;
  }

  options(value: ComboboxOption[]): this {
    this._config.options = value;
    return this;
  }

  resourceFactory(value: FilterOptionsResourceFactory): this {
    this._config.resourceFactory = value;
    return this;
  }

  build(): FilterDefinition {
    return { key: this.key, label: this.label, type: this.type, ...this._config };
  }
}

/**
 * Fluent builder for {@link FilterDefinition}.
 *
 * @example
 * ```ts
 * readonly filters: FilterDefinition[] = [
 *   FilterDef.text('author', 'Author').placeholder('e.g. igor'),
 *   FilterDef.select('status', 'Status').options(statusOptions),
 *   FilterDef.combobox('assignee', 'Assignee').resourceFactory(usersFactory),
 * ];
 * ```
 */
export class FilterDef {
  // ─── Plain text-like ──────────────────────────────────────────────────────

  static text(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'text');
  }

  static number(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'number');
  }

  static email(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'email');
  }

  static url(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'url');
  }

  static cpf(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'cpf');
  }

  static cnpj(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'cnpj');
  }

  // ─── Date / time ──────────────────────────────────────────────────────────

  static date(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'date');
  }

  static datetime(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'datetime');
  }

  static month(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'month');
  }

  static time(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'time');
  }

  // ─── Option-based ─────────────────────────────────────────────────────────

  static select(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'select');
  }

  static selectMultiple(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'selectMultiple');
  }

  static combobox(key: string, label: string): FilterDefBuilder {
    return new FilterDefBuilder(key, label, 'combobox');
  }
}
