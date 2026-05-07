import { describe, expect, it } from 'vitest';
import { toggleItemByValue } from './toggle-item-by-value';

describe('toggleItemByValue', () => {
  it('should remove existing value', () => {
    const items = [{ value: 1 }, { value: 2 }];
    expect(toggleItemByValue(items, { value: 2 })).toEqual([{ value: 1 }]);
  });

  it('should append missing value', () => {
    const items = [{ value: 1 }];
    expect(toggleItemByValue(items, { value: 2 })).toEqual([{ value: 1 }, { value: 2 }]);
  });
});
