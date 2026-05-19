import type { ComboboxOption } from '../../combobox/combobox';
import type { FilterDefinition, FilterEntry } from '../filter.models';

export function buildFilterPickerOptions(
  definitions: FilterDefinition[],
  entries: FilterEntry[],
): ComboboxOption<string>[] {
  const activeKeys = new Set(entries.map((entry) => entry.key));

  return definitions
    .filter((definition) => definition.allowMultiple || !activeKeys.has(definition.key))
    .map((definition) => ({ value: definition.key, label: definition.label, data: undefined }))
    .sort((left, right) => left.label.localeCompare(right.label, 'pt-BR', { sensitivity: 'base' }));
}
