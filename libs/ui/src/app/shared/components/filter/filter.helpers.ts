import type { ComboboxOption } from '../combobox/combobox';
import type { FilterDefinition, FilterEntry } from './filter.models';

export function buildFilterDefinitionMap(
  definitions: FilterDefinition[],
): Map<string, FilterDefinition> {
  const map = new Map<string, FilterDefinition>();

  for (const definition of definitions) {
    map.set(definition.key, definition);
  }

  return map;
}

export function buildFilterPickerOptions(
  definitions: FilterDefinition[],
  entries: FilterEntry[],
): ComboboxOption<string>[] {
  const activeKeys = new Set(entries.map((entry) => entry.key));

  return definitions
    .filter((definition) => definition.allowMultiple || !activeKeys.has(definition.key))
    .map((definition) => ({ value: definition.key, label: definition.label }));
}

export function createFilterEntry(definition: FilterDefinition, index: number): FilterEntry {
  return {
    id: `${definition.key}-${index}`,
    key: definition.key,
    value: definition.type === 'selectMultiple' ? [] : null,
  };
}
