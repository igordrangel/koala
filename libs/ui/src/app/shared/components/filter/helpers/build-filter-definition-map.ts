import type { FilterDefinition } from '../filter.models';

export function buildFilterDefinitionMap(
  definitions: FilterDefinition[],
): Map<string, FilterDefinition> {
  const map = new Map<string, FilterDefinition>();

  for (const definition of definitions) {
    map.set(definition.key, definition);
  }

  return map;
}
