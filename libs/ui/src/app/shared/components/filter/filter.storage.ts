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
    if (Array.isArray(v.value)) {
      params[v.key] = v.value.length > 0 ? v.value.map(String) : '';
      continue;
    }

    if (v.value === null || v.value === undefined) {
      params[v.key] = '';
      continue;
    }

    params[v.key] = String(v.value);
  }

  return params;
}
