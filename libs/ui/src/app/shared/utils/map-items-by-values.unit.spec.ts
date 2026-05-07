import { describe, expect, it } from 'vitest';
import { mapItemsByValues } from './map-items-by-values';

describe('mapItemsByValues', () => {
  it('should map from current items and fallback to previous cache', () => {
    const current = [{ value: 1, label: 'One' }];
    const previous = [{ value: 2, label: 'Two (cached)' }];

    expect(mapItemsByValues([1, 2, 3], current, previous)).toEqual([
      { value: 1, label: 'One' },
      { value: 2, label: 'Two (cached)' },
    ]);
  });
});
