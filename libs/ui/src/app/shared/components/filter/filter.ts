import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComboboxOption } from '../combobox/combobox';
import { FilterEntryComponent } from './filter-entry/filter-entry';
import { FilterPicker } from './filter-picker/filter-picker';
import {
  DEFAULT_FILTER_I18N,
  FilterDefinition,
  FilterEntry,
  FilterI18n,
  FilterSize,
  FilterValue,
  FilterVariant,
} from './filter.models';
import {
  hydrateEntriesFromQueryParams,
  setupHydrationEffect,
  setupSyncRouterEffect,
} from './effects';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterEntryComponent, FilterPicker],
  host: { class: 'block' },
})
export class Filter {
  readonly definitions = input<FilterDefinition[]>([]);
  readonly size = input<FilterSize>('sm');
  readonly variant = input<FilterVariant>('default');
  readonly i18n = input<FilterI18n>(DEFAULT_FILTER_I18N);

  readonly filtersChange = output<FilterValue[]>();

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly entries = signal<FilterEntry[]>([]);

  readonly pendingOpenId = signal<string | null>(null);

  private readonly hydrationComplete = signal(false);
  private nextId = 0;
  private readonly nextIdRef = { value: 0 };

  readonly definitionMap = computed(() => {
    const map = new Map<string, FilterDefinition>();
    for (const d of this.definitions()) map.set(d.key, d);
    return map;
  });

  readonly pickerOptions = computed<ComboboxOption<string>[]>(() => {
    const activeKeys = new Set(this.entries().map((e) => e.key));
    return this.definitions()
      .filter((d) => d.allowMultiple || !activeKeys.has(d.key))
      .map((d) => ({ value: d.key, label: d.label }));
  });

  readonly hasAvailableFilters = computed(() => this.pickerOptions().length > 0);

  readonly resolvedValues = computed<FilterValue[]>(() => {
    const map = this.definitionMap();
    return this.entries()
      .map((entry) => {
        const d = map.get(entry.key);
        if (!d) return null;
        return {
          key: d.key,
          label: d.label,
          type: d.type,
          value: entry.value,
        } satisfies FilterValue;
      })
      .filter((v): v is FilterValue => !!v);
  });

  constructor() {
    this.nextIdRef.value = this.nextId;

    setupSyncRouterEffect({
      hydrationComplete: () => this.hydrationComplete(),
      resolvedValues: () => this.resolvedValues(),
      definitions: () => this.definitions(),
      emitFiltersChange: (values) => this.filtersChange.emit(values),
      router: this.router,
      route: this.route,
    });

    setupHydrationEffect({
      definitions: () => this.definitions(),
      entries: () => this.entries(),
      setEntries: (entries) => this.entries.set(entries),
      hydrationComplete: () => this.hydrationComplete(),
      setHydrationComplete: (value) => this.hydrationComplete.set(value),
      hydrateFromQueryParams: (definitions) =>
        hydrateEntriesFromQueryParams({
          entries: this.entries(),
          definitions,
          nextIdRef: this.nextIdRef,
          hasKey: (key) => this.route.snapshot.queryParamMap.has(key),
          getValue: (key) => this.route.snapshot.queryParamMap.get(key),
          getValues: (key) => this.route.snapshot.queryParamMap.getAll(key),
        }),
    });

    this.nextId = this.nextIdRef.value;
  }

  private addFilter(key: string): string | null {
    const d = this.definitionMap().get(key);
    if (!d) return null;
    if (!d.allowMultiple && this.entries().some((e) => e.key === key)) return null;

    const entry: FilterEntry = {
      id: `${d.key}-${this.nextId++}`,
      key: d.key,
      value: d.type === 'selectMultiple' ? [] : null,
    };

    this.entries.update((entries) => [...entries, entry]);
    return entry.id;
  }

  addFilterByKey(key: string) {
    const id = this.addFilter(key);
    if (id) this.pendingOpenId.set(id);
  }

  removeLastFilter() {
    const entries = this.entries();
    if (!entries.length) return;
    this.removeFilter(entries[entries.length - 1].id);
  }

  removeFilter(entryId: string) {
    this.entries.update((entries) => entries.filter((e) => e.id !== entryId));
  }

  getDefinition(key: string) {
    return this.definitionMap().get(key) ?? null;
  }

  getOptions(definition: FilterDefinition): ComboboxOption[] {
    return definition.options ?? [];
  }

  onEntryValueChange(event: { entryId: string; value: unknown }) {
    this.entries.update((entries) =>
      entries.map((e) => (e.id !== event.entryId ? e : { ...e, value: event.value })),
    );
  }
}

export { FilterDef } from './filter.builder';
export { DEFAULT_FILTER_I18N } from './filter.models';
export type {
  FilterDefinition,
  FilterI18n,
  FilterSize,
  FilterValue,
  FilterVariant,
} from './filter.models';
