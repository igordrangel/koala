import { DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { FilterDefinition } from '../../../filter.models';

type Getter<T> = () => T;

export function setupSelectFieldEffects(config: {
  destroyRef: DestroyRef;
  selectControl: FormControl<unknown>;
  definition: Getter<FilterDefinition>;
  entryValue: Getter<unknown>;
  entryId: Getter<string>;
  isEditing: Getter<boolean>;
  tryCommitValue: (value: unknown) => boolean;
  closeEdit: () => boolean;
  emitTab: () => void;
}) {
  // Handle select value changes
  config.selectControl.valueChanges
    .pipe(takeUntilDestroyed(config.destroyRef))
    .subscribe((value) => {
      if (!config.tryCommitValue(value ?? null)) return;
      if (config.isEditing() && value != null && value !== '' && config.closeEdit()) {
        config.emitTab();
      }
    });

  // Initialize select control when entry changes (new filter selected)
  effect(() => {
    // Access entryId to track when entry changes
    config.entryId();
    config.selectControl.setValue(config.entryValue() ?? null, { emitEvent: false });
  });
}
