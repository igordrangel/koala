import { DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { FilterDefinition } from '../filter.models';

type Getter<T> = () => T;

export function setupFilterEntryGlobalEffects(config: {
  destroyRef: DestroyRef;
  comboboxControl: FormControl<unknown>;
  selectMultipleControl: FormControl<unknown>;
  definition: Getter<FilterDefinition>;
  entryValue: Getter<unknown>;
  entryId: Getter<string>;
  isEditing: Getter<boolean>;
  autoOpen: Getter<boolean>;
  tryCommitValue: (value: unknown) => boolean;
  closeEdit: () => boolean;
  emitTab: () => void;
  openEdit: () => void;
}) {
  // Handle combobox value changes
  config.comboboxControl.valueChanges
    .pipe(takeUntilDestroyed(config.destroyRef))
    .subscribe((value) => {
      if (!config.tryCommitValue(value)) return;
    });

  // Initialize combobox control when entry changes (new filter selected)
  effect(() => {
    if (config.definition().type === 'combobox' && !config.isEditing()) {
      // Access entryId to track when entry changes
      config.entryId();
      config.comboboxControl.setValue(config.entryValue(), { emitEvent: false });
    }
  });

  // Handle selectMultiple value changes
  config.selectMultipleControl.valueChanges
    .pipe(takeUntilDestroyed(config.destroyRef))
    .subscribe((value) => config.tryCommitValue(Array.isArray(value) ? value : []));

  // Sync selectMultiple control with entry value (only for selectMultiple type and not while editing)
  effect(() => {
    if (config.definition().type === 'selectMultiple' && !config.isEditing()) {
      // Access entryId to track when entry changes
      config.entryId();
      const value = config.entryValue();
      config.selectMultipleControl.setValue(Array.isArray(value) ? value : [], {
        emitEvent: false,
      });
    }
  });

  // Auto-open edit mode when flag is set
  effect(() => {
    if (config.autoOpen()) {
      queueMicrotask(() => config.openEdit());
    }
  });
}
