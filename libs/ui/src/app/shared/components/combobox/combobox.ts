import { Loading } from '@/shared/components/loading/loading';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  Injector,
  inject,
  input,
  Resource,
  ResourceRef,
  runInInjectionContext,
  signal,
  Signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Combobox as AriaCombobox, ComboboxInput } from '@angular/aria/combobox';
import { Listbox as AriaListbox, Option as AriaOption } from '@angular/aria/listbox';

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

function isDestroyableResource<TValue, TData>(
  resource: ComboboxResourceResult<TValue, TData>,
): resource is ResourceRef<ComboboxOption<TValue, TData>[] | undefined> {
  return 'destroy' in resource;
}

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AriaCombobox, ComboboxInput, AriaListbox, AriaOption, Loading],
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

  readonly options = input<ComboboxOption[]>([]);
  readonly placeholder = input('Select an option');
  readonly emptyMessage = input('No records found');
  readonly searchingMessage = input('Searching...');
  readonly searchDebounce = input(500);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly resourceFactory = input<ComboboxResourceFactory | undefined>(undefined);

  readonly isOpen = signal(false);
  readonly inputValue = signal('');
  readonly filterValue = signal('');
  readonly selectedOption = signal<ComboboxOption | null>(null);
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
    effect((onCleanup) => {
      const factory = this.resourceFactory();
      let createdResource: ComboboxResourceResult | null = null;
      let canceled = false;

      this.remoteResource.set(null);

      if (!factory) {
        onCleanup(() => {
          canceled = true;
        });

        return;
      }

      queueMicrotask(() => {
        if (canceled) {
          return;
        }

        const resource = runInInjectionContext(this.injector, () =>
          factory(this.filterValue.asReadonly()),
        );

        if (canceled) {
          if (isDestroyableResource(resource)) {
            resource.destroy();
          }

          return;
        }

        createdResource = resource;
        this.remoteResource.set(resource);
      });

      onCleanup(() => {
        canceled = true;

        if (createdResource && isDestroyableResource(createdResource)) {
          createdResource.destroy();
        }
      });
    });

    effect((onCleanup) => {
      const value = this.inputValue();
      const debounce = this.searchDebounce();

      if (this.skipNextFilterSync) {
        this.skipNextFilterSync = false;
        this.filterValue.set('');
        return;
      }

      const timeout = setTimeout(() => {
        this.filterValue.set(value.trim());
      }, debounce);

      onCleanup(() => {
        clearTimeout(timeout);
      });
    });

    effect(() => {
      const currentValue = this.internalValue();
      const selectedOption = this.selectedOption();

      if (selectedOption && Object.is(selectedOption.value, currentValue)) {
        return;
      }

      const matchedOption = this.resolvedOptions().find((option) =>
        Object.is(option.value, currentValue),
      );

      if (!matchedOption) {
        if (currentValue == null || currentValue === '') {
          this.selectedOption.set(null);
          if (!this.isOpen()) {
            this.setInputValue('', true);
          }
        }

        return;
      }

      this.selectedOption.set(matchedOption);

      if (!this.isOpen()) {
        this.setInputValue(matchedOption.label, true);
      }
    });
  }

  writeValue(value: unknown): void {
    this.internalValue.set(value);

    if (value == null || value === '') {
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

  handleInput(value: string) {
    this.inputValue.set(value);

    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  selectOption(option: ComboboxOption) {
    this.selectedOption.set(option);
    this.internalValue.set(option.value);
    this.onChange(option.value);
    this.setInputValue(option.label, true);
    this.close();
  }

  clearSelection() {
    this.selectedOption.set(null);
    this.internalValue.set(null);
    this.onChange(null);
    this.setInputValue('');
  }

  close() {
    this.isOpen.set(false);
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

  private restoreSelectedLabel() {
    const selectedOption = this.selectedOption();
    this.setInputValue(selectedOption?.label ?? '', true);
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
}
