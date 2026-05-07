import type { FilterDefinition, FilterEntry } from '../filter.models';

export function createFilterEntry(definition: FilterDefinition, index: number): FilterEntry {
  return {
    id: `${definition.key}-${index}`,
    key: definition.key,
    value: definition.type === 'selectMultiple' ? [] : null,
  };
}
