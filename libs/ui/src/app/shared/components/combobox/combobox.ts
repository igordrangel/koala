import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  Injector,
  inject,
  input,
  Resource,
  ResourceRef,
  signal,
  Signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Combobox as AriaCombobox } from '@angular/aria/combobox';
import {
  removeSelectedOption,
  selectedOptionsToValues,
  toggleSelectedOption,
} from './combobox.multiple.helpers';
import { getNextActiveIndex } from './combobox.navigation.helpers';
import {
  asArrayValue,
  getRestoredInputValue,
  hasLabelInSelectedOptions,
  isEmptyValue,
} from './combobox.state.helpers';
import { ComboboxOptionsPanelComponent } from './parts/combobox-options-panel.component';
import { ComboboxTriggerComponent } from './parts/combobox-trigger.component';
import {
  setupActiveIndexEffect,
  setupFilterSyncEffect,
  setupRemoteResourceEffect,
  setupSelectionEffect,
} from './effects';

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
) => ComboboxResourceResult<TValue, TData>;

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  readonly options = input<ComboboxOption[]>([]);
  readonly placeholder = input('Select an option');
  readonly emptyMessage = input('No records found');
  readonly searchingMessage = input('Searching...');
  readonly searchDebounce = input(500);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly resourceFactory = input<ComboboxResourceFactory | undefined>(undefined);

  readonly isOpen = signal(false);
  readonly inputValue = signal('');
  readonly filterValue = signal('');
  readonly activeIndex = signal(-1);
  readonly selectedOption = signal<ComboboxOption | null>(null);
  readonly selectedOptions = signal<ComboboxOption[]>([]);
  readonly internalValue = signal<unknown>(null);
  readonly remoteResource = signal<ComboboxResourceResult | null>(null);

  readonly isRemote = computed(() => !!this.resourceFactory());
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled);
  readonly isLoading = computed(() => this.remoteResource()?.isLoading() ?? false);

  readonly resolvedOptions = computed(() => {
    const remoteResource = this.remoteResource();

    if (remoteResource) {
      return remoteResource.hasValue() ? (remoteResource.value() ?? []) : [];
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

  private syncMultipleSelection(option: ComboboxOption) {
    const next = toggleSelectedOption(this.selectedOptions(), option);
    const nextValues = selectedOptionsToValues(next);

    this.selectedOptions.set(next);
    this.internalValue.set(nextValues);
    this.onChange(nextValues);
    this.suppressNextInputEvent = true;
    this.clearMultipleInput();
  }

  private syncSingleSelection(option: ComboboxOption) {
    this.selectedOption.set(option);
    this.internalValue.set(option.value);
    this.onChange(option.value);
    this.setInputValue(option.label, true);
    this.close();
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

  handleInputFocus() {
    if (this.isDisabled()) {
      return;
    }

    this.isOpen.set(true);
  }

  handleInputKeydown(event: KeyboardEvent) {
    const options = this.resolvedOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        }
        if (!options.length) {
          return;
        }
        this.activeIndex.update((index) => getNextActiveIndex(index, options.length, 'down'));
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!options.length) {
          return;
        }
        this.activeIndex.update((index) => getNextActiveIndex(index, options.length, 'up'));
        break;

      case 'Enter': {
        if (!this.isOpen()) {
          return;
        }
        const activeOption = options[this.activeIndex()] ?? null;
        if (!activeOption) {
          return;
        }
        event.preventDefault();
        this.selectOption(activeOption);
        break;
      }

      case 'Escape':
        if (!this.isOpen()) {
          return;
        }
        event.preventDefault();
        this.close();
        break;
    }
  }

  handleInput(value: string) {
    if (this.multiple() && this.suppressNextInputEvent) {
      this.suppressNextInputEvent = false;
      this.clearMultipleInput();
      return;
    }

    if (this.multiple() && hasLabelInSelectedOptions(this.selectedOptions(), value)) {
      this.clearMultipleInput();
      return;
    }

    this.inputValue.set(value);

    if (!this.isOpen()) {
      this.isOpen.set(true);
    }

    queueMicrotask(() => this.updateActiveIndexFromOptions());
  }

  selectOption(option: ComboboxOption) {
    if (this.multiple()) {
      this.syncMultipleSelection(option);
      return;
    }

    this.syncSingleSelection(option);
  }

  clearSelection() {
    if (this.multiple()) {
      this.selectedOptions.set([]);
      this.internalValue.set([]);
      this.onChange([]);
      this.clearMultipleInput();
      return;
    }

    this.selectedOption.set(null);
    this.internalValue.set(null);
    this.onChange(null);
    this.setInputValue('');
  }

  removeOption(optionValue: unknown) {
    if (this.isDisabled() || !this.multiple()) {
      return;
    }

    const next = removeSelectedOption(this.selectedOptions(), optionValue);
    const nextValues = selectedOptionsToValues(next);

    this.selectedOptions.set(next);
    this.internalValue.set(nextValues);
    this.onChange(nextValues);
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
