import { effect } from '@angular/core';
import { FilterDefinition, FilterEntry, FilterValue } from '../filter.models';

export function hydrateEntriesFromQueryParams(params: {
  entries: FilterEntry[];
  definitions: FilterDefinition[];
  nextIdRef: { value: number };
  hasKey: (key: string) => boolean;
  getValue: (key: string) => string | null;
  getValues: (key: string) => string[];
}): FilterEntry[] {
  if (params.entries.length > 0) {
    return params.entries;
  }

  const hydrated: FilterEntry[] = [];

  for (const definition of params.definitions) {
    if (!params.hasKey(definition.key)) {
      continue;
    }

    let value: FilterValue['value'];
    if (definition.type === 'selectMultiple') {
      value = params.getValues(definition.key);
    } else {
      value = params.getValue(definition.key);
    }

    hydrated.push({
      id: `${definition.key}-${params.nextIdRef.value++}`,
      key: definition.key,
      value,
    });
  }

  return hydrated;
}

export function setupHydrationEffect(params: {
  definitions: () => FilterDefinition[];
  entries: () => FilterEntry[];
  setEntries: (entries: FilterEntry[]) => void;
  hydrationComplete: () => boolean;
  setHydrationComplete: (value: boolean) => void;
  hydrateFromQueryParams: (definitions: FilterDefinition[]) => FilterEntry[];
}) {
  effect(() => {
    const definitions = params.definitions();
    const keys = new Set(definitions.map((definition) => definition.key));
    const filtered = params.entries().filter((entry) => keys.has(entry.key));

    if (filtered.length !== params.entries().length) {
      params.setEntries(filtered);
    }

    if (params.hydrationComplete()) {
      return;
    }

    const hydrated = params.hydrateFromQueryParams(definitions);
    params.setEntries(hydrated);
    params.setHydrationComplete(true);
  });
}
