import { DestroyRef, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { syncValidationControlWithDefinition } from '../../filter-entry.utils';
import { FilterDefinition } from '../../../filter.models';

type Getter<T> = () => T;

export function setupDateFieldEffects(config: {
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

  // Initialize validation control when entry changes (new filter selected)
  effect(() => {
    // Access entryId to track when entry changes
    config.entryId();
    config.validationControl.setValue(config.entryValue(), { emitEvent: false });
    config.updateInvalidState();
  });
}
