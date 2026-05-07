import { FilterValue } from './filter.models';

/**
 * Builds a flat queryParams object where each filter key maps to its value.
 * Keys that are no longer active are set to `null` so Angular removes them from the URL.
 */
export function buildQueryParams(
  values: FilterValue[],
  allDefinitionKeys: string[],
): Record<string, string | string[] | null> {
  const params: Record<string, string | string[] | null> = {};

  for (const key of allDefinitionKeys) {
    params[key] = null;
  }

  for (const v of values) {
    if (v.value === null || v.value === undefined || v.value === '') continue;
    params[v.key] = Array.isArray(v.value) ? v.value.map(String) : String(v.value);
  }

  return params;
}
