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
import {
  getOptionLabel,
  getSelectCheckIconClass,
  getSelectSizeClass,
  getTriggerLabel,
  toggleSelectValue,
} from './select.helpers';

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
  readonly activeIndex = signal(-1);
  readonly selectedValues = signal<unknown[]>([]);

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled);

  readonly triggerLabel = computed(() => {
    return getTriggerLabel(this.selectedValues(), this.options(), this.placeholder());
  });

  readonly buttonClass = computed(() => {
    const isDisabled = this.isDisabled();
    const cursor = isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
    const opacity = isDisabled ? 'opacity-60' : '';
    const base = `flex w-full items-center gap-2 text-left transition ${cursor} ${opacity}`;

    if (this.inline()) {
      return `${base} bg-transparent border-0 h-auto min-h-0 px-0 py-0 shadow-none rounded-none text-inherit`;
    }

    return `${base} rounded-lg border border-base-300 bg-base-100 text-base-content shadow-xs ${getSelectSizeClass(this.size())}`;
  });

  readonly dropdownClass = computed(() => (this.inline() ? 'min-w-36' : 'w-full'));

  readonly badgeClass = computed(() => {
    return `badge badge-${this.badgeVariant()} badge-${this.badgeStyle()} badge-${this.badgeSize()} h-auto gap-2 border border-base-300 px-2 py-1 font-medium`;
  });

  readonly checkIconClass = computed(() => {
    return getSelectCheckIconClass(this.badgeVariant());
  });

  toggleOpen() {
    if (this.isDisabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
      return;
    }

    this.openDropdown();
  }

  isSelected(value: unknown): boolean {
    return this.selectedValues().some((v) => Object.is(v, value));
  }

  selectOption(value: unknown) {
    if (this.isDisabled()) return;

    if (this.multiple()) {
      const current = this.selectedValues();
      const next = toggleSelectValue(current, value);
      this.selectedValues.set(next);
      this.onChange(next);
    } else {
      this.selectedValues.set([value]);
      this.closeDropdown();
      this.onChange(value);
      this.onTouched();
    }
  }

  onTriggerKeydown(event: KeyboardEvent) {
    if (this.isDisabled()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
          return;
        }
        this.moveActive(1);
        return;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
          return;
        }
        this.moveActive(-1);
        return;

      case 'Enter':
      case ' ': {
        event.preventDefault();

        if (!this.isOpen()) {
          this.openDropdown();
          return;
        }

        const option = this.options()[this.activeIndex()];
        if (!option || option.disabled) {
          return;
        }

        this.selectOption(option.value);
        return;
      }

      case 'Escape':
        if (!this.isOpen()) {
          return;
        }
        event.preventDefault();
        this.closeDropdown();
        this.onTouched();
        return;
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
    return getOptionLabel(this.options(), value, `${value}`);
  }

  handleDocumentPointerDown(event: PointerEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      if (this.isOpen()) {
        this.closeDropdown();
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

  private openDropdown() {
    this.isOpen.set(true);

    const selectedValue = this.selectedValues()[0];
    const selectedIndex = this.options().findIndex((option) =>
      Object.is(option.value, selectedValue),
    );

    if (selectedIndex >= 0 && !this.options()[selectedIndex]?.disabled) {
      this.activeIndex.set(selectedIndex);
      return;
    }

    const firstEnabled = this.options().findIndex((option) => !option.disabled);
    this.activeIndex.set(firstEnabled);
  }

  private closeDropdown() {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  private moveActive(step: 1 | -1) {
    const options = this.options();

    if (!options.length) {
      this.activeIndex.set(-1);
      return;
    }

    let index = this.activeIndex();

    for (let i = 0; i < options.length; i++) {
      index = (index + step + options.length) % options.length;

      if (!options[index]?.disabled) {
        this.activeIndex.set(index);
        return;
      }
    }
  }
}
