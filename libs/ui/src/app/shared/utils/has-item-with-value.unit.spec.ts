import { describe, expect, it } from 'vitest';
import { hasItemWithValue } from './has-item-with-value';

describe('hasItemWithValue', () => {
  const items = [{ value: 'a' }, { value: 'b' }];

  it('should return true when value exists', () => {
    expect(hasItemWithValue(items, 'a')).toBe(true);
  });

  it('should return false when value does not exist', () => {
    expect(hasItemWithValue(items, 'z')).toBe(false);
  });
});
