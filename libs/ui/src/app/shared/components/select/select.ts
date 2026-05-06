import {
  booleanAttribute,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  Injector,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import type { ClassValue } from 'clsx';

export type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({
  selector: 'select[appSelect]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor, OnInit {
  private readonly elementRef = inject<ElementRef<HTMLSelectElement>>(
    ElementRef<HTMLSelectElement>,
  );
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private formDisabled = false;
  private modelValue = '';

  readonly class = input<ClassValue>('');
  readonly size = input<SelectSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });

  private get sizeClass() {
    switch (this.size()) {
      case 'xs':
        return 'select-xs';
      case 'sm':
        return 'select-sm';
      case 'md':
        return 'select-md';
      case 'lg':
        return 'select-lg';
      case 'xl':
        return 'select-xl';
    }
  }

  constructor() {
    effect(() => {
      const select = this.elementRef.nativeElement;

      for (const key of select.classList) {
        if (key.startsWith('select')) {
          select.classList.remove(key);
        }
      }

      select.classList.add('select', this.sizeClass);
      select.classList.add(...this.class()!.toString().split(' ').filter(Boolean));
    });

    effect(() => {
      const select = this.elementRef.nativeElement;
      select.disabled = this.disabled() || this.formDisabled;
    });
  }

  ngOnInit(): void {
    const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
    const control = ngControl?.control;

    if (!control) {
      return;
    }

    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.writeValue(value);
    });
  }

  @HostListener('change', ['$event'])
  protected handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement | null)?.value ?? '';
    this.onChange(value);
  }

  @HostListener('blur')
  protected handleBlur() {
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.modelValue = value == null ? '' : String(value);
    this.applyValueToSelect();

    // Re-apply after async option rendering (@for) to prevent blank visual state.
    queueMicrotask(() => {
      this.applyValueToSelect();
      requestAnimationFrame(() => {
        this.applyValueToSelect();
      });
    });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
    this.elementRef.nativeElement.disabled = this.disabled() || this.formDisabled;
  }

  private normalizeEmptyPlaceholderOption(select: HTMLSelectElement) {
    const placeholder = Array.from(select.options).find(
      (option) => option.disabled && option.selected && !option.hasAttribute('value'),
    );

    if (!placeholder) {
      return;
    }

    placeholder.value = '';
    placeholder.setAttribute('value', '');
  }

  private applyValueToSelect() {
    const select = this.elementRef.nativeElement;
    this.normalizeEmptyPlaceholderOption(select);
    select.value = this.modelValue;

    if (this.modelValue !== '' || select.value === '') {
      return;
    }

    const placeholder = Array.from(select.options).find((option) => option.value === '');
    if (!placeholder) {
      return;
    }

    placeholder.selected = true;
    select.selectedIndex = placeholder.index;
  }
}
