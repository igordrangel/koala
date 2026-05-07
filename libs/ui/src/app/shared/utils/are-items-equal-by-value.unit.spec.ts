import { describe, expect, it } from 'vitest';
import { areItemsEqualByValue } from './are-items-equal-by-value';

describe('areItemsEqualByValue', () => {
  it('should return true for same order and values', () => {
    expect(areItemsEqualByValue([{ value: 1 }, { value: 2 }], [{ value: 1 }, { value: 2 }])).toBe(
      true,
    );
  });

  it('should return false for different order or length', () => {
    expect(areItemsEqualByValue([{ value: 1 }, { value: 2 }], [{ value: 2 }, { value: 1 }])).toBe(
      false,
    );
    expect(areItemsEqualByValue([{ value: 1 }], [{ value: 1 }, { value: 2 }])).toBe(false);
  });
});
