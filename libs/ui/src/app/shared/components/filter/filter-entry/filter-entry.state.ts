import { DestroyRef, ElementRef, Injector, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ComboboxOption } from '../../combobox/combobox';
import {
  FilterDefinition,
  FilterEntry,
  FilterI18n,
  FilterSize,
  FilterVariant,
} from '../filter.models';
import { isValidationControlInvalid, validateControlCandidate } from './filter-entry.utils';
import { setupTextFieldEffects } from './fields/text/text-field.effects';
import { setupSelectFieldEffects } from './fields/select/select-field.effects';
import { setupCurrencyFieldEffects } from './fields/currency/currency-field.effects';
import { setupDateFieldEffects } from './fields/date/date-field.effects';
import { setupFilterEntryGlobalEffects } from './filter-entry-global.effects';
import {
  getChipKeyAction,
  getFieldKeyAction,
  resolveCandidateValue,
  resolveCommittedValue,
  resetPendingValue,
  setPendingNumericValue,
  setPendingText,
} from './filter-entry.handlers';
import { createFilterEntryPresentation } from './filter-entry-presentation';
import { FilterEntryResourceState } from './filter-entry-resource-state';

type Getter<T> = () => T;

export class FilterEntryState {
  readonly isEditing = signal(false);
  readonly comboboxControl = new FormControl<unknown>(null);
  readonly selectControl = new FormControl<unknown>(null);
  readonly selectMultipleControl = new FormControl<unknown>(null);
  readonly currencyControl = new FormControl<number | null>(null);
  readonly currencyInputDisplay = signal('');
  readonly isInvalid = signal(false);

  private pending = resetPendingValue();
  private readonly pendingSignal = signal(resetPendingValue());
  readonly validationControl = new FormControl<unknown>(null);
  private readonly resources: FilterEntryResourceState;
  private readonly presentation: ReturnType<typeof createFilterEntryPresentation>;

  readonly resolvedOptions;
  readonly resolvedComboboxOptions;
  readonly comboboxResourceFactory;
  readonly isRemoteValueLoading;
  readonly displayValue;
  readonly entryTextValue;
  readonly resolvedPlaceholder;
  readonly inputType;
  readonly inputMode;
  readonly inputMask;
  readonly currencyConfig;
  readonly currencyDecimalDigits;
  readonly removeLabel;
  readonly chipClass;
  readonly comboboxClass;
  readonly fieldWidthCh;
  readonly dateFieldWidthCh;

  constructor(
    private readonly config: {
      destroyRef: DestroyRef;
      injector: Injector;
      elementRef: ElementRef<HTMLElement>;
      entry: Getter<FilterEntry>;
      definition: Getter<FilterDefinition>;
      options: Getter<ComboboxOption[]>;
      size: Getter<FilterSize>;
      variant: Getter<FilterVariant>;
      autoOpen: Getter<boolean>;
      i18n: Getter<FilterI18n>;
      emitValue: (value: unknown) => void;
      emitRemove: (id: string) => void;
      emitTab: () => void;
    },
  ) {
    this.resources = new FilterEntryResourceState({
      injector: this.config.injector,
      definition: () => this.definition(),
      entryValue: () => this.entryValue(),
      options: () => this.options(),
    });
    this.presentation = createFilterEntryPresentation({
      definition: () => this.definition(),
      entryValue: () => this.entryValue(),
      pendingText: () => this.pendingSignal().text,
      resolvedOptions: () => this.resources.resolvedOptions(),
      getCachedSelectedLabel: (value) => this.resources.getCachedSelectedLabel(value),
      isRemoteValueLoading: () => this.resources.isRemoteValueLoading(),
      i18n: () => this.i18n(),
      size: () => this.size(),
      variant: () => this.variant(),
      isInvalid: () => this.isInvalid(),
      isEditing: () => this.isEditing(),
      currencyInputDisplay: () => this.currencyInputDisplay(),
    });

    this.resolvedOptions = this.resources.resolvedOptions;
    this.resolvedComboboxOptions = this.resources.resolvedComboboxOptions;
    this.comboboxResourceFactory = this.resources.comboboxResourceFactory;
    this.isRemoteValueLoading = this.resources.isRemoteValueLoading;
    this.displayValue = this.presentation.displayValue;
    this.entryTextValue = this.presentation.entryTextValue;
    this.resolvedPlaceholder = this.presentation.resolvedPlaceholder;
    this.inputType = this.presentation.inputType;
    this.inputMode = this.presentation.inputMode;
    this.inputMask = this.presentation.inputMask;
    this.currencyConfig = this.presentation.currencyConfig;
    this.currencyDecimalDigits = this.presentation.currencyDecimalDigits;
    this.removeLabel = this.presentation.removeLabel;
    this.chipClass = this.presentation.chipClass;
    this.comboboxClass = this.presentation.comboboxClass;
    this.fieldWidthCh = this.presentation.fieldWidthCh;
    this.dateFieldWidthCh = this.presentation.dateFieldWidthCh;

    this.validationControl.statusChanges
      .pipe(takeUntilDestroyed(config.destroyRef))
      .subscribe(() => this.updateInvalidState());
    this.setupEffects();
  }

  openEdit() {
    if (this.isEditing()) return;
    this.pending = resetPendingValue();
    this.pendingSignal.set(resetPendingValue());
    this.currencyInputDisplay.set('');
    this.isEditing.set(true);
  }

  closeEdit(): boolean {
    const candidateValue = resolveCandidateValue(this.entryValue(), this.pending);

    if (!this.validateCandidate(candidateValue)) return false;

    const { nextPending, commitValue } = resolveCommittedValue(this.pending);
    this.pending = nextPending;
    this.pendingSignal.set(nextPending);

    if (commitValue !== undefined) {
      this.config.emitValue(commitValue);
    }

    this.currencyInputDisplay.set('');
    this.isEditing.set(false);
    return true;
  }

  onChipKeydown(event: KeyboardEvent) {
    switch (getChipKeyAction(event)) {
      case 'open':
        this.openEdit();
        break;
      case 'remove':
        this.removeCurrent();
        break;
    }
  }

  onFieldKeydown(event: KeyboardEvent) {
    switch (getFieldKeyAction(event, this.entryValue())) {
      case 'remove':
        this.removeCurrent();
        break;
      case 'cancel':
        this.pending = resetPendingValue();
        this.pendingSignal.set(resetPendingValue());
        this.currencyInputDisplay.set('');
        this.isEditing.set(false);
        break;
      case 'tab':
        if (this.closeEdit()) this.config.emitTab();
        break;
    }
  }

  onTextChange(value: string) {
    this.pending = setPendingText(value);
    this.pendingSignal.set(this.pending);
    this.validateCandidate(this.pending.text);
  }

  onDateChange(value?: string) {
    this.tryCommitValue(value || null);
  }

  onCurrencyInput(value: string) {
    this.currencyInputDisplay.set(value ?? '');
  }

  onComboboxOptionSelected(option: ComboboxOption) {
    this.resources.onComboboxOptionSelected(option);
  }

  removeCurrent() {
    this.config.emitRemove(this.entry().id);
  }

  onDocumentPointerDown(event: PointerEvent) {
    if (!this.isEditing() || !(event.target instanceof Node)) return;
    if (!this.config.elementRef.nativeElement.contains(event.target)) this.closeEdit();
  }

  private entry() {
    return this.config.entry();
  }

  private entryValue() {
    return this.entry().value;
  }

  private definition() {
    return this.config.definition();
  }

  private options() {
    return this.config.options();
  }

  private size() {
    return this.config.size();
  }

  private variant() {
    return this.config.variant();
  }

  private i18n() {
    return this.config.i18n();
  }

  private setupEffects() {
    // Setup text field effects (handles validation for all text-like fields)
    setupTextFieldEffects({
      destroyRef: this.config.destroyRef,
      validationControl: this.validationControl,
      definition: () => this.definition(),
      entryValue: () => this.entryValue(),
      entryId: () => this.entry().id,
        validateCandidate: (value) => this.validateCandidate(value),
      updateInvalidState: () => this.updateInvalidState(),
    });

    // Setup select field effects (only for 'select' type)
    setupSelectFieldEffects({
      destroyRef: this.config.destroyRef,
      selectControl: this.selectControl,
      definition: () => this.definition(),
      entryValue: () => this.entryValue(),
      entryId: () => this.entry().id,
      isEditing: () => this.isEditing(),
      tryCommitValue: (value) => this.tryCommitValue(value),
      closeEdit: () => this.closeEdit(),
      emitTab: () => this.config.emitTab(),
    });

    // Setup currency field effects (only for 'currency' type)
    setupCurrencyFieldEffects({
      destroyRef: this.config.destroyRef,
      currencyControl: this.currencyControl,
      definition: () => this.definition(),
      entryValue: () => this.entryValue(),
      entryId: () => this.entry().id,
      currencyConfig: () => this.currencyConfig(),
      tryCommitValue: (value) => this.tryCommitValue(value),
      setPendingNumeric: (value) => {
        this.pending = setPendingNumericValue(value);
        this.pendingSignal.set(this.pending);
      },
      validatePendingNumeric: (value) => {
        this.validateCandidate(value);
      },
    });

    // Setup date field effects (only for 'date' and 'dateRange' types)
    setupDateFieldEffects({
      destroyRef: this.config.destroyRef,
      validationControl: this.validationControl,
      definition: () => this.definition(),
      entryValue: () => this.entryValue(),
      entryId: () => this.entry().id,
      updateInvalidState: () => this.updateInvalidState(),
    });

    // Setup global effects (combobox, selectMultiple, autoOpen)
    setupFilterEntryGlobalEffects({
      destroyRef: this.config.destroyRef,
      comboboxControl: this.comboboxControl,
      selectMultipleControl: this.selectMultipleControl,
      definition: () => this.definition(),
      entryValue: () => this.entryValue(),
      entryId: () => this.entry().id,
      isEditing: () => this.isEditing(),
      autoOpen: () => this.config.autoOpen(),
      tryCommitValue: (value) => this.tryCommitValue(value),
      closeEdit: () => this.closeEdit(),
      emitTab: () => this.config.emitTab(),
      openEdit: () => this.openEdit(),
    });
  }

  private updateInvalidState() {
    this.isInvalid.set(isValidationControlInvalid(this.validationControl));
  }

  private validateCandidate(value: unknown): boolean {
    const isValid = validateControlCandidate(this.validationControl, value);
    this.updateInvalidState();
    return isValid;
  }

  private tryCommitValue(value: unknown): boolean {
    if (!this.validateCandidate(value)) return false;
    this.config.emitValue(value);
    return true;
  }
}
