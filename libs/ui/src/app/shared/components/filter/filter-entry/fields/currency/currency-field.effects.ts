import { DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { FilterCurrencyConfig, FilterDefinition } from '../../../filter.models';
import { coerceFilterCurrencyValue } from '../../filter-entry.utils';

type Getter<T> = () => T;

export function setupCurrencyFieldEffects(config: {
  destroyRef: DestroyRef;
  currencyControl: FormControl<number | null>;
  definition: Getter<FilterDefinition>;
  entryValue: Getter<unknown>;
  entryId: Getter<string>;
  currencyConfig: Getter<FilterCurrencyConfig | undefined>;
  tryCommitValue: (value: unknown) => boolean;
  setPendingNumeric: (value: number | null) => void;
  validatePendingNumeric: (value: number | null) => void;
}) {
  // Handle currency value changes
  config.currencyControl.valueChanges
    .pipe(takeUntilDestroyed(config.destroyRef))
    .subscribe((value) => {
      const numericValue = value ?? null;
      config.setPendingNumeric(numericValue);
      config.validatePendingNumeric(numericValue);
    });

  // Initialize currency control when entry changes (new filter selected)
  effect(() => {
    if (config.definition().type === 'currency') {
      // Access entryId to track when entry changes
      config.entryId();
      config.currencyControl.setValue(
        coerceFilterCurrencyValue(config.entryValue(), config.currencyConfig() ?? {}),
        { emitEvent: false },
      );
    }
  });
}
