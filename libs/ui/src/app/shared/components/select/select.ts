import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption<TValue = unknown> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

export type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SelectBadgeVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
export type SelectBadgeStyle = 'soft' | 'outline' | 'dash';
export type SelectBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
  host: {
    class: 'relative block',
    '(document:pointerdown)': 'handleDocumentPointerDown($event)',
    '(focusout)': 'handleFocusOut()',
  },
})
export class Select implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};
  private formDisabled = false;

  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input('Select an option');
  readonly size = input<SelectSize>('md');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly inline = input(false, { transform: booleanAttribute });
  readonly badgeVariant = input<SelectBadgeVariant>('success');
  readonly badgeStyle = input<SelectBadgeStyle>('soft');
  readonly badgeSize = input<SelectBadgeSize>('xs');

  readonly isOpen = signal(false);
  readonly selectedValues = signal<unknown[]>([]);

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled);

  readonly triggerLabel = computed(() => {
    const selected = this.selectedValues();
    if (selected.length === 0) return this.placeholder();
    if (selected.length === 1) {
      const opt = this.options().find((o) => Object.is(o.value, selected[0]));
      return opt?.label ?? this.placeholder();
    }
    return this.placeholder();
  });

  readonly buttonClass = computed(() => {
    const isDisabled = this.isDisabled();
    const cursor = isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
    const opacity = isDisabled ? 'opacity-60' : '';
    const base = `flex w-full items-center gap-2 text-left transition ${cursor} ${opacity}`;

    if (this.inline()) {
      return `${base} bg-transparent border-0 h-auto min-h-0 px-0 py-0 shadow-none rounded-none text-inherit`;
    }

    const sizeMap: Record<SelectSize, string> = {
      xs: 'min-h-6 text-xs px-2',
      sm: 'min-h-8 text-sm px-2.5',
      md: 'min-h-10 text-sm px-3',
      lg: 'min-h-12 text-base px-3.5',
      xl: 'min-h-14 text-lg px-4',
    };

    return `${base} rounded-lg border border-base-300 bg-base-100 text-base-content shadow-xs ${sizeMap[this.size()]}`;
  });

  readonly dropdownClass = computed(() => (this.inline() ? 'min-w-36' : 'w-full'));

  readonly badgeClass = computed(() => {
    return `badge badge-${this.badgeVariant()} badge-${this.badgeStyle()} badge-${this.badgeSize()} h-auto gap-2 border border-base-300 px-2 py-1 font-medium`;
  });

  readonly checkIconClass = computed(() => {
    switch (this.badgeVariant()) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary';
      case 'accent':
        return 'text-accent';
      case 'info':
        return 'text-info';
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-neutral';
    }
  });

  toggleOpen() {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  isSelected(value: unknown): boolean {
    return this.selectedValues().some((v) => Object.is(v, value));
  }

  selectOption(value: unknown) {
    if (this.isDisabled()) return;

    if (this.multiple()) {
      const current = this.selectedValues();
      const next = this.isSelected(value)
        ? current.filter((v) => !Object.is(v, value))
        : [...current, value];
      this.selectedValues.set(next);
      this.onChange(next);
    } else {
      this.selectedValues.set([value]);
      this.isOpen.set(false);
      this.onChange(value);
      this.onTouched();
    }
  }

  clearAll(event: MouseEvent) {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.selectedValues.set([]);
    this.onChange(this.multiple() ? [] : null);
  }

  removeOne(event: MouseEvent, value: unknown) {
    event.stopPropagation();
    if (this.isDisabled()) return;
    const next = this.selectedValues().filter((v) => !Object.is(v, value));
    this.selectedValues.set(next);
    this.onChange(next);
  }

  getOptionLabel(value: unknown): string {
    return this.options().find((o) => Object.is(o.value, value))?.label ?? `${value}`;
  }

  handleDocumentPointerDown(event: PointerEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      if (this.isOpen()) {
        this.isOpen.set(false);
        this.onTouched();
      }
    }
  }

  handleFocusOut() {
    if (!this.elementRef.nativeElement.contains(document.activeElement)) {
      this.onTouched();
    }
  }

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.selectedValues.set(Array.isArray(value) ? value : []);
    } else {
      this.selectedValues.set(value != null && value !== '' ? [value] : []);
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
}
