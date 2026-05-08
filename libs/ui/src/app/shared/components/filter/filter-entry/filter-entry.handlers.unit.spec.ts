import { describe, expect, it, vi } from 'vitest';
import {
  getChipKeyAction,
  getFieldKeyAction,
  resolveCandidateValue,
  resolveCommittedValue,
  resetPendingValue,
  setPendingNumericValue,
  setPendingText,
} from './filter-entry.handlers';

function createKeyboardEvent(key: string, shiftKey = false): KeyboardEvent {
  return {
    key,
    shiftKey,
    preventDefault: vi.fn(),
  } as unknown as KeyboardEvent;
}

describe('filter-entry.handlers', () => {
  it('pending helpers should resolve candidate and commit values', () => {
    const pendingText = setPendingText('  igor  ');
    expect(resolveCandidateValue('old', pendingText)).toBe('igor');

    const resolvedText = resolveCommittedValue(pendingText);
    expect(resolvedText.commitValue).toBe('igor');
    expect(resolvedText.nextPending).toEqual(resetPendingValue());

    const pendingNumeric = setPendingNumericValue(42);
    expect(resolveCandidateValue('old', pendingNumeric)).toBe(42);
    expect(resolveCommittedValue(pendingNumeric).commitValue).toBe(42);
  });

  it('getChipKeyAction should map open and remove actions', () => {
    expect(getChipKeyAction(createKeyboardEvent('Enter'))).toBe('open');
    expect(getChipKeyAction(createKeyboardEvent(' '))).toBe('open');
    expect(getChipKeyAction(createKeyboardEvent('Backspace'))).toBe('remove');
    expect(getChipKeyAction(createKeyboardEvent('Delete'))).toBe('remove');
    expect(getChipKeyAction(createKeyboardEvent('Tab'))).toBeNull();
  });

  it('getFieldKeyAction should map escape and enter actions', () => {
    expect(getFieldKeyAction(createKeyboardEvent('Escape'), 'value')).toBe('cancel');
    expect(getFieldKeyAction(createKeyboardEvent('Escape'), null)).toBe('remove');
    expect(getFieldKeyAction(createKeyboardEvent('Enter'), 'value')).toBe('tab');
    expect(getFieldKeyAction(createKeyboardEvent('Tab'), 'value')).toBeNull();
    expect(getFieldKeyAction(createKeyboardEvent('Tab', true), 'value')).toBeNull();
  });
});
