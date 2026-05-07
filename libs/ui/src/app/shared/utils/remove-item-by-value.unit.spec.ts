import { describe, expect, it } from 'vitest';
import { removeItemByValue } from './remove-item-by-value';

describe('removeItemByValue', () => {
  it('should remove items by value', () => {
    const items = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];

    expect(removeItemByValue(items, 1)).toEqual([{ value: 2, label: 'Two' }]);
  });
});
