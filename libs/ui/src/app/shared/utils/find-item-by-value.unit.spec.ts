import { describe, expect, it } from 'vitest';
import { findItemByValue } from './find-item-by-value';

describe('findItemByValue', () => {
  const items = [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
  ];

  it('should return matched item by value', () => {
    expect(findItemByValue(items, 2)).toEqual({ value: 2, label: 'Two' });
  });

  it('should return null when value is not found', () => {
    expect(findItemByValue(items, 99)).toBeNull();
  });
});
