import { hasCommittedFilterValue } from './filter-entry.utils';

export interface PendingFilterEntryValue {
  text: string | null;
  value: unknown;
  hasPendingText: boolean;
}

export type FilterEntryKeyAction = 'open' | 'remove' | 'cancel' | 'tab' | null;

export function resetPendingValue(): PendingFilterEntryValue {
  return {
    text: null,
    value: undefined,
    hasPendingText: false,
  };
}

export function setPendingText(value: string): PendingFilterEntryValue {
  return {
    text: value.trim() || null,
    value: undefined,
    hasPendingText: true,
  };
}

export function setPendingNumericValue(value: number | null): PendingFilterEntryValue {
  return {
    text: value === null ? null : String(value),
    value,
    hasPendingText: true,
  };
}

export function resolveCandidateValue(
  currentValue: unknown,
  pending: PendingFilterEntryValue,
): unknown {
  if (!pending.hasPendingText) {
    return currentValue;
  }

  return pending.value !== undefined ? pending.value : pending.text;
}

export function resolveCommittedValue(pending: PendingFilterEntryValue): {
  nextPending: PendingFilterEntryValue;
  commitValue?: unknown;
} {
  if (!pending.hasPendingText) {
    return { nextPending: pending };
  }

  return {
    nextPending: resetPendingValue(),
    commitValue: pending.value !== undefined ? pending.value : pending.text,
  };
}

export function getChipKeyAction(event: KeyboardEvent): FilterEntryKeyAction {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    return 'open';
  }

  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();
    return 'remove';
  }

  return null;
}

export function getFieldKeyAction(
  event: KeyboardEvent,
  currentValue: unknown,
): FilterEntryKeyAction {
  if (event.key === 'Escape') {
    event.preventDefault();
    return hasCommittedFilterValue(currentValue) ? 'cancel' : 'remove';
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    return 'tab';
  }

  return null;
}
