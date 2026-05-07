import { describe, expect, it } from 'vitest';
import { togglePrimitiveValue } from './toggle-primitive-value';

describe('togglePrimitiveValue', () => {
  it('should remove existing primitive value', () => {
    expect(togglePrimitiveValue(['a', 'b'], 'b')).toEqual(['a']);
  });

  it('should append missing primitive value', () => {
    expect(togglePrimitiveValue(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
  });
});
