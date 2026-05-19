import { DestroyRef, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { syncValidationControlWithDefinition } from '../../filter-entry.utils';
import { FilterDefinition } from '../../../filter.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Getter<T> = () => T;

export function setupTextFieldEffects(config: {
  destroyRef: DestroyRef;
  validationControl: FormControl<unknown>;
  definition: Getter<FilterDefinition>;
  entryValue: Getter<unknown>;
  entryId: Getter<string>;
  updateInvalidState: () => void;
}) {
  // Sync validation control with definition when field type or validators change
  effect(() => {
    syncValidationControlWithDefinition(config.validationControl, config.definition());
    config.validationControl.updateValueAndValidity({ emitEvent: false });
    config.updateInvalidState();
  });

  // Handle text value changes from user input
  config.validationControl.valueChanges
    .pipe(takeUntilDestroyed(config.destroyRef))
    .subscribe(() => config.updateInvalidState());

  // Initialize validation control when entry changes (new filter selected)
  effect(() => {
    // Access entryId to track when entry changes
    config.entryId();
    // Only reset if we're not in edit mode to avoid interfering with user input
    config.validationControl.setValue(config.entryValue(), { emitEvent: false });
    config.updateInvalidState();
  });
}
