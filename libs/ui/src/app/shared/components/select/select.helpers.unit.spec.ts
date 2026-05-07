import { describe, expect, it } from 'vitest';
import { getOptionLabel, getTriggerLabel, toggleSelectValue } from './select.helpers';

describe('select.helpers', () => {
  const options = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
  ];

  it('getOptionLabel should resolve label by value', () => {
    expect(getOptionLabel(options, 'open', 'Fallback')).toBe('Open');
    expect(getOptionLabel(options, 'draft', 'Fallback')).toBe('Fallback');
  });

  it('getTriggerLabel should return placeholder for empty and multiple values', () => {
    expect(getTriggerLabel([], options, 'Pick status')).toBe('Pick status');
    expect(getTriggerLabel(['open', 'closed'], options, 'Pick status')).toBe('Pick status');
  });

  it('getTriggerLabel should return option label for single value', () => {
    expect(getTriggerLabel(['closed'], options, 'Pick status')).toBe('Closed');
  });

  it('toggleSelectValue should add and remove values', () => {
    expect(toggleSelectValue(['open'], 'open')).toEqual([]);
    expect(toggleSelectValue(['open'], 'closed')).toEqual(['open', 'closed']);
  });
});
