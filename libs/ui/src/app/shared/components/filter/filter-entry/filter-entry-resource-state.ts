import { computed, effect, Injector, runInInjectionContext, signal } from '@angular/core';
import { ComboboxOption, ComboboxResourceFactory } from '../../combobox/combobox';
import {
  FilterDefinition,
  FilterOptionsResource,
  FilterOptionsResourceFactory,
} from '../filter.models';

type Getter<T> = () => T;

function isDestroyable(
  resource: FilterOptionsResource,
): resource is FilterOptionsResource & { destroy(): void } {
  return 'destroy' in resource;
}

export class FilterEntryResourceState {
  private readonly resourceRef = signal<FilterOptionsResource | null>(null);
  private readonly selectedLabelCache = signal<Record<string, string>>({});
  private adaptedComboboxFactory: ComboboxResourceFactory<unknown> | undefined;
  private adaptedFromFactory: FilterOptionsResourceFactory | undefined;
  private skipNextComboboxHydration = false;

  readonly valuesSignal = computed<unknown[]>(() => {
    const value = this.config.entryValue();
    if (Array.isArray(value)) return value;
    if (value == null || value === '') return [];
    return [value];
  });

  readonly resolvedOptions = computed<ComboboxOption[]>(() => {
    const resource = this.resourceRef();
    return resource?.hasValue() ? (resource.value() ?? []) : this.config.options();
  });

  readonly resolvedComboboxOptions = computed<ComboboxOption[]>(() => {
    const value = this.config.entryValue();
    const cachedLabel = this.getCachedSelectedLabel(value);
    const options = this.resolvedOptions();

    if (value == null || value === '' || !cachedLabel) return options;
    if (options.some((option) => `${option.value}` === `${value}`)) return options;
    return [{ value, label: cachedLabel }, ...options];
  });

  readonly comboboxResourceFactory = computed<ComboboxResourceFactory<unknown> | undefined>(() => {
    const definition = this.config.definition();
    const factory = definition.resourceFactory;

    if (definition.type !== 'combobox' || !factory) {
      this.adaptedComboboxFactory = undefined;
      this.adaptedFromFactory = undefined;
      return undefined;
    }

    if (this.adaptedFromFactory === factory && this.adaptedComboboxFactory) {
      return this.adaptedComboboxFactory;
    }

    this.adaptedFromFactory = factory;
    this.adaptedComboboxFactory = (filter, selectedValues) => factory(selectedValues, filter);
    return this.adaptedComboboxFactory;
  });

  readonly hasRemoteScalarValue = computed(() => {
    const definition = this.config.definition();
    const value = this.config.entryValue();

    if (
      !definition.resourceFactory ||
      (definition.type !== 'select' && definition.type !== 'combobox')
    ) {
      return false;
    }

    return value != null && value !== '' && !Array.isArray(value);
  });

  readonly isRemoteValueLoading = computed(() => {
    const resource = this.resourceRef();
    return this.hasRemoteScalarValue() && (!resource || resource.isLoading());
  });

  constructor(
    private readonly config: {
      injector: Injector;
      definition: Getter<FilterDefinition>;
      entryValue: Getter<unknown>;
      options: Getter<ComboboxOption[]>;
    },
  ) {
    effect(() => {
      if (!this.hasRemoteScalarValue()) {
        this.selectedLabelCache.set({});
      }
    });

    effect((onCleanup) => {
      const definition = this.config.definition();
      const factory = definition.resourceFactory;
      const hasRemoteScalarValue = this.hasRemoteScalarValue();

      this.resourceRef.set(null);

      if (!factory) {
        return;
      }

      if (definition.type === 'combobox' && this.skipNextComboboxHydration) {
        this.skipNextComboboxHydration = false;
        return;
      }

      if (definition.type === 'combobox' && !hasRemoteScalarValue) {
        return;
      }

      let created: FilterOptionsResource | null = null;
      let canceled = false;

      queueMicrotask(() => {
        if (canceled) return;

        const resource = runInInjectionContext(this.config.injector, () =>
          factory(this.valuesSignal),
        );

        if (canceled) {
          if (isDestroyable(resource)) resource.destroy();
          return;
        }

        created = resource;
        this.resourceRef.set(resource);
      });

      onCleanup(() => {
        canceled = true;
        if (created && isDestroyable(created)) created.destroy();
      });
    });
  }

  onComboboxOptionSelected(option: ComboboxOption) {
    const key = `${option.value}`;
    const label = option.label.trim();

    if (!key || !label) {
      return;
    }

    this.selectedLabelCache.set({ [key]: label });
    this.skipNextComboboxHydration = true;
  }

  getCachedSelectedLabel(value: unknown): string | null {
    if (value == null || value === '') {
      return null;
    }

    return this.selectedLabelCache()[`${value}`] ?? null;
  }
}
