import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  Injector,
  inject,
  input,
  output,
  Resource,
  ResourceRef,
  signal,
  Signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Combobox as AriaCombobox } from '@angular/aria/combobox';
import { getRestoredInputValue, asArrayValue, isEmptyValue } from './helpers';
import { ComboboxOptionsPanelComponent } from './parts/combobox-options-panel.component';
import { ComboboxTriggerComponent } from './parts/combobox-trigger.component';
import {
  setupActiveIndexEffect,
  setupFilterSyncEffect,
  setupRemoteResourceEffect,
  setupSelectionEffect,
} from './effects';
import { setupComboboxKeyboardHandling } from './combobox.keyboard-handlers';
import { ComboboxInputHandlers } from './combobox.input-handlers';

export interface ComboboxOption<TValue = unknown, TData = unknown> {
  value: TValue;
  label: string;
  data?: TData;
  disabled?: boolean;
}

export type ComboboxResourceResult<TValue = unknown, TData = unknown> =
  | Resource<ComboboxOption<TValue, TData>[] | undefined>
  | ResourceRef<ComboboxOption<TValue, TData>[] | undefined>;

export type ComboboxResourceFactory<TValue = unknown, TData = unknown> = (
  filter: Signal<string>,
  selectedValues: Signal<TValue[]>,
) => ComboboxResourceResult<TValue, TData>;

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.html',
  imports: [AriaCombobox, ComboboxTriggerComponent, ComboboxOptionsPanelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Combobox),
      multi: true,
    },
  ],
  host: {
    class: 'block',
    '(document:pointerdown)': 'handleDocumentPointerDown($event)',
    '(focusout)': 'handleFocusOut()',
  },
})
export class Combobox implements ControlValueAccessor {
  private readonly injector = inject(Injector);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};
  private formDisabled = false;
  private skipNextFilterSync = false;
  private suppressNextInputEvent = false;
  private readonly inputHandlers = new ComboboxInputHandlers({
    multiple: () => this.multiple(),
    selectedOptions: () => this.selectedOptions(),
    selectedOption: () => this.selectedOption(),
    resolvedOptions: () => this.resolvedOptions(),
    inputValue: () => this.inputValue(),
    isOpen: () => this.isOpen(),
    internalValue: () => this.internalValue(),
    suppressNextInputEvent: this.suppressNextInputEvent,
    skipNextFilterSync: this.skipNextFilterSync,
    setInputValue: (value, resetFilter) => this.setInputValue(value, resetFilter),
    setSelectedOptions: (options) => this.selectedOptions.set(options),
    setSelectedOption: (option) => this.selectedOption.set(option),
    setInternalValue: (value) => this.internalValue.set(value),
    setIsOpen: (value) => this.isOpen.set(value),
    setSuppressionFlag: (value) => {
      this.suppressNextInputEvent = value;
    },
    setSkipNextFilterSyncFlag: (value) => {
      this.skipNextFilterSync = value;
    },
    onChange: (value) => this.onChange(value),
    clearMultipleInput: () => this.clearMultipleInput(),
    updateActiveIndexFromOptions: () => this.updateActiveIndexFromOptions(),
  });
  private readonly keyboardHandler = setupComboboxKeyboardHandling({
    isOpen: () => this.isOpen(),
    activeIndex: () => this.activeIndex(),
    resolvedOptions: () => this.resolvedOptions(),
    setIsOpen: (value) => this.isOpen.set(value),
    setActiveIndex: (value) => this.activeIndex.set(value),
    selectOption: (option) => this.selectOption(option),
    close: () => this.close(),
  });

  readonly options = input<ComboboxOption[]>([]);
  readonly placeholder = input('Select an option');
  readonly emptyMessage = input('No records found');
  readonly searchingMessage = input('Searching...');
  readonly searchDebounce = input(500);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly resourceFactory = input<ComboboxResourceFactory<unknown> | undefined>(undefined);

  readonly isOpen = signal(false);
  readonly inputValue = signal('');
  readonly filterValue = signal('');
  readonly activeIndex = signal(-1);
  readonly selectedOption = signal<ComboboxOption | null>(null);
  readonly selectedOptions = signal<ComboboxOption[]>([]);
  readonly internalValue = signal<unknown>(null);
  readonly remoteResource = signal<ComboboxResourceResult | null>(null);
  readonly selectedValues = computed(() => {
    const value = this.internalValue();

    if (Array.isArray(value)) {
      return value;
    }

    if (value == null || value === '') {
      return [];
    }

    return [value];
  });

  readonly isRemote = computed(() => !!this.resourceFactory());
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled);
  readonly isLoading = computed(() => this.remoteResource()?.isLoading() ?? false);
  readonly optionSelected = output<ComboboxOption>();

  readonly resolvedOptions = computed(() => {
    const remoteResource = this.remoteResource();

    if (remoteResource) {
      if (remoteResource.hasValue()) {
        return remoteResource.value() ?? [];
      }

      const fallbackOptions = this.options();
      if (fallbackOptions.length) {
        return fallbackOptions;
      }

      return [];
    }

    const filter = this.filterValue().trim().toLocaleLowerCase();
    if (!filter) {
      return this.options();
    }

    return this.options().filter((option) => option.label.toLocaleLowerCase().includes(filter));
  });

  readonly showEmptyState = computed(
    () => !this.isLoading() && this.resolvedOptions().length === 0,
  );

  constructor() {
    setupRemoteResourceEffect({
      injector: this.injector,
      resourceFactory: () => this.resourceFactory(),
      filterSignal: this.filterValue.asReadonly(),
      selectedValuesSignal: this.selectedValues,
      setRemoteResource: (resource) => this.remoteResource.set(resource),
    });

    setupFilterSyncEffect({
      inputValue: () => this.inputValue(),
      searchDebounce: () => this.searchDebounce(),
      consumeSkipNextFilterSync: () => {
        if (!this.skipNextFilterSync) {
          return false;
        }

        this.skipNextFilterSync = false;
        return true;
      },
      setFilterValue: (value) => this.filterValue.set(value),
    });

    setupSelectionEffect({
      multiple: () => this.multiple(),
      internalValue: () => this.internalValue(),
      resolvedOptions: () => this.resolvedOptions(),
      inputValue: () => this.inputValue(),
      selectedOptions: () => this.selectedOptions(),
      selectedOption: () => this.selectedOption(),
      isOpen: () => this.isOpen(),
      setSelectedOptions: (value) => this.selectedOptions.set(value),
      setSelectedOption: (value) => this.selectedOption.set(value),
      setInputValue: (value, resetFilter) => this.setInputValue(value, resetFilter),
    });

    setupActiveIndexEffect({
      isOpen: () => this.isOpen(),
      resolvedOptions: () => this.resolvedOptions(),
      selectedOption: () => this.selectedOption(),
      setActiveIndex: (index) => this.activeIndex.set(index),
    });
  }

  private restoreSelectedLabel() {
    this.setInputValue(getRestoredInputValue(this.multiple(), this.selectedOption()), true);
  }

  private setInputValue(value: string, resetFilter = false) {
    if (resetFilter) {
      this.skipNextFilterSync = true;
    }

    this.inputValue.set(value);

    if (resetFilter) {
      this.filterValue.set('');
    }
  }

  private forceClearInputElement() {
    const clear = () => {
      const inputEl = this.elementRef.nativeElement.querySelector('input');
      if (inputEl instanceof HTMLInputElement) {
        inputEl.value = '';
      }
    };

    queueMicrotask(clear);
    requestAnimationFrame(clear);
  }

  private clearMultipleInput() {
    this.setInputValue('', true);
    this.forceClearInputElement();
  }

  private updateActiveIndexFromOptions() {
    const options = this.resolvedOptions();
    this.activeIndex.set(options.length ? 0 : -1);
  }

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.internalValue.set(asArrayValue(value));
      this.setInputValue('', true);
      return;
    }

    this.internalValue.set(value);

    if (isEmptyValue(value)) {
      this.selectedOption.set(null);
      this.setInputValue('', true);
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
  }

  handleInputKeydown(event: KeyboardEvent) {
    this.keyboardHandler(event);
  }

  handleInputFocus() {
    if (this.isDisabled()) {
      return;
    }

    this.isOpen.set(true);
  }

  handleInput(value: string) {
    this.inputHandlers.handleInputEvent(value);
  }

  selectOption(option: ComboboxOption) {
    if (this.multiple()) {
      this.inputHandlers.syncMultipleSelection(option);
      this.optionSelected.emit(option);
      return;
    }

    this.inputHandlers.syncSingleSelection(option);
    this.optionSelected.emit(option);
    this.close();
  }

  clearSelection() {
    this.inputHandlers.clearSelection();
  }

  removeOption(optionValue: unknown) {
    if (this.isDisabled()) {
      return;
    }

    this.inputHandlers.removeOption(optionValue);
  }

  close() {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.restoreSelectedLabel();
    this.onTouched();
  }

  handleDocumentPointerDown(event: PointerEvent) {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (this.elementRef.nativeElement.contains(target)) {
      return;
    }

    this.close();
  }

  handleFocusOut() {
    setTimeout(() => {
      if (!this.isOpen()) {
        return;
      }

      const activeElement = document.activeElement;
      if (activeElement && this.elementRef.nativeElement.contains(activeElement)) {
        return;
      }

      this.close();
    }, 0);
  }
}
