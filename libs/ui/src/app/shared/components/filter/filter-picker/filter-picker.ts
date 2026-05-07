import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ComboboxOption } from '../../combobox/combobox';
import { FilterSize } from '../filter.models';

const INPUT_SIZE: Record<FilterSize, string> = {
  xs: 'h-6 text-[10px]',
  sm: 'h-8 text-sm',
  md: 'h-9 text-base',
  lg: 'h-10 text-base',
  xl: 'h-12 text-lg',
};

@Component({
  selector: 'app-filter-picker',
  templateUrl: './filter-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative flex-1',
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
})
export class FilterPicker {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly options = input<ComboboxOption[]>([]);
  readonly placeholder = input('Filter by...');
  readonly size = input<FilterSize>('sm');

  readonly pick = output<string>();
  readonly backspaceOnEmpty = output<void>();

  readonly inputValue = signal('');
  readonly isOpen = signal(false);
  readonly activeIndex = signal(-1);
  readonly inputClass = computed(
    () =>
      `w-full min-w-24 border-0 bg-transparent px-2 text-base-content outline-none placeholder:text-base-content/40 ${INPUT_SIZE[this.size()]}`,
  );

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  readonly filtered = computed(() => {
    const q = this.inputValue().trim().toLocaleLowerCase();
    if (!q) {
      return this.options();
    }
    return this.options().filter((o) => o.label.toLocaleLowerCase().includes(q));
  });

  focus() {
    this.inputRef()?.nativeElement.focus();
  }

  onInput(value: string) {
    this.inputValue.set(value);
    this.isOpen.set(true);
    this.activeIndex.set(value.trim() ? 0 : -1);
  }

  onFocus() {
    this.isOpen.set(true);
  }

  onKeydown(event: KeyboardEvent) {
    const items = this.filtered();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => Math.min(i + 1, items.length - 1));
        this.isOpen.set(true);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => Math.max(i - 1, 0));
        break;

      case 'Enter':
      case 'Tab': {
        if (event.key === 'Tab' && event.shiftKey) {
          break;
        }

        const idx = this.activeIndex();
        const item = idx >= 0 ? items[idx] : items[0];
        if (item) {
          event.preventDefault();
          this.select(item);
        }
        break;
      }

      case 'Backspace':
        if (!this.inputValue()) {
          this.backspaceOnEmpty.emit();
        }
        break;

      case 'Escape':
        this.close();
        break;
    }
  }

  select(option: ComboboxOption) {
    this.pick.emit(option.value as string);
    this.inputRef()?.nativeElement.blur();
    this.inputValue.set('');
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  close() {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  onDocumentPointerDown(event: PointerEvent) {
    if (!this.isOpen()) {
      return;
    }
    if (!(event.target instanceof Node)) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
