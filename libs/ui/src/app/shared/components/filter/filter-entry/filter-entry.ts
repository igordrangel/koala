import { Combobox, ComboboxOption } from '../../combobox/combobox';
import { InputCalendar } from '../../calendar/input-calendar';
import { Input } from '../../input-field/input';
import { Select } from '../../select/select';
import { Mask } from '../../../directives/mask.directive';
import { KlDate } from '@koalarx/utils/light/KlDate';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DEFAULT_FILTER_I18N,
  FilterDefinition,
  FilterEntry,
  FilterI18n,
  FilterOptionsResource,
  FilterSize,
  FilterVariant,
} from '../filter.models';

function isDestroyable(r: FilterOptionsResource): r is FilterOptionsResource & { destroy(): void } {
  return 'destroy' in r;
}

const CHIP_SIZE: Record<FilterSize, string> = {
  xs: 'text-[10px] py-0.5 pl-2 pr-1 gap-1',
  sm: 'text-xs py-1 pl-2.5 pr-1.5 gap-1.5',
  md: 'text-sm py-1.5 pl-3 pr-2 gap-1.5',
  lg: 'text-base py-2 pl-3.5 pr-2.5 gap-2',
  xl: 'text-lg py-2.5 pl-4 pr-3 gap-2.5',
};

const CHIP_VARIANT: Record<FilterVariant, string> = {
  default: 'border-base-300 bg-base-200 text-base-content hover:bg-base-300',
  primary: 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
  secondary: 'border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/20',
  accent: 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20',
  info: 'border-info/30 bg-info/10 text-info hover:bg-info/20',
  success: 'border-success/30 bg-success/10 text-success hover:bg-success/20',
  warning: 'border-warning/30 bg-warning/10 text-warning hover:bg-warning/20',
  error: 'border-error/30 bg-error/10 text-error hover:bg-error/20',
};

const FIELD_SIZE: Record<FilterSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

const INPUT_TYPE_BY_FIELD: Record<string, string> = {
  number: 'number',
  email: 'email',
  url: 'url',
  date: 'date',
  datetime: 'datetime-local',
  month: 'month',
  time: 'time',
};

const INPUT_MODE_BY_FIELD: Record<string, string> = {
  cpf: 'numeric',
  number: 'numeric',
  email: 'email',
  url: 'url',
};

const INPUT_MASK_BY_FIELD: Partial<Record<string, string>> = {
  cpf: '000.000.000-00',
  cnpj: 'SS.SSS.SSS/SSSS-SS',
};

@Component({
  selector: 'app-filter-entry',
  templateUrl: './filter-entry.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Combobox, Input, InputCalendar, Mask, Select],
  host: {
    class: 'relative inline-flex',
    '(click)': '$event.stopPropagation()',
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
})
export class FilterEntryComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly entry = input.required<FilterEntry>();
  readonly definition = input.required<FilterDefinition>();
  readonly options = input<ComboboxOption[]>([]);
  readonly size = input<FilterSize>('sm');
  readonly variant = input<FilterVariant>('default');
  readonly autoOpen = input(false);
  readonly i18n = input<FilterI18n>(DEFAULT_FILTER_I18N);

  readonly valueChange = output<{ entryId: string; value: unknown }>();
  readonly remove = output<string>();
  readonly tabFromField = output<void>();

  readonly isEditing = signal(false);
  readonly comboboxControl = new FormControl<unknown>(null);
  readonly selectControl = new FormControl<unknown>(null);
  readonly selectMultipleControl = new FormControl<unknown>(null);

  private readonly fieldRef = viewChild<ElementRef<HTMLElement>>('fieldEl');
  private readonly resourceRef = signal<FilterOptionsResource | null>(null);

  private readonly valuesSignal = computed<unknown[]>(() => {
    const v = this.entry().value;
    if (Array.isArray(v)) return v;
    if (v == null || v === '') return [];
    return [v];
  });

  readonly resolvedOptions = computed<ComboboxOption[]>(() => {
    const r = this.resourceRef();
    if (r?.hasValue()) return r.value() ?? [];
    return this.options();
  });

  readonly isRemoteValueLoading = computed(() => {
    const definition = this.definition();
    const value = this.entry().value;

    if (
      !definition.resourceFactory ||
      (definition.type !== 'select' && definition.type !== 'combobox')
    ) {
      return false;
    }

    if (value == null || value === '' || Array.isArray(value)) {
      return false;
    }

    const hasMatchingOption = this.resolvedOptions().some(
      (option) => `${option.value}` === `${value}`,
    );

    if (hasMatchingOption) {
      return false;
    }

    return !this.resourceRef()?.hasValue();
  });

  readonly displayValue = computed<string | null>(() => {
    const value = this.entry().value;
    const opts = this.resolvedOptions();
    const type = this.definition().type;

    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return null;
    }

    if (type === 'selectMultiple' && Array.isArray(value)) {
      const joined = value
        .map((v) => opts.find((o) => `${o.value}` === `${v}`)?.label ?? `${v}`)
        .join(', ');
      return joined || null;
    }

    if (type === 'select' || type === 'combobox') {
      const foundOption = opts.find((o) => `${o.value}` === `${value}`);

      if (foundOption) {
        return foundOption.label;
      }

      if (this.isRemoteValueLoading()) {
        return null;
      }

      return `${value}`;
    }

    if (type === 'date' && typeof value === 'string') {
      try {
        return new KlDate(`${value}T00:00:00`).format('dd/MM/yyyy');
      } catch {
        return value;
      }
    }

    return `${value}`;
  });

  readonly entryTextValue = computed(() => {
    const value = this.entry().value;
    return value == null ? '' : `${value}`;
  });

  readonly resolvedPlaceholder = computed<string>(() => {
    const definition = this.definition();

    if (definition.placeholder) {
      return definition.placeholder;
    }

    switch (definition.type) {
      case 'cpf':
        return '000.000.000-00';
      case 'cnpj':
        return 'SS.SSS.SSS/SSSS-SS';
      case 'date':
        return 'dd/MM/yyyy';
      case 'datetime':
        return 'dd/MM/yyyy HH:mm';
      case 'month':
        return 'MM/yyyy';
      default:
        return this.i18n().selectPlaceholder || 'Select';
    }
  });

  readonly inputType = computed(() => {
    const fieldType = this.definition().type;
    return INPUT_TYPE_BY_FIELD[fieldType] ?? 'text';
  });

  readonly inputMode = computed(() => {
    const fieldType = this.definition().type;
    return INPUT_MODE_BY_FIELD[fieldType] ?? 'text';
  });

  readonly inputMask = computed(() => {
    const fieldType = this.definition().type;
    return INPUT_MASK_BY_FIELD[fieldType];
  });

  readonly removeLabel = computed(() => this.i18n().removeLabel);

  readonly chipClass = computed(() => {
    const variant: FilterVariant = this.definition().variant ?? this.variant();
    return `inline-flex items-center rounded-full border font-medium transition ${CHIP_SIZE[this.size()]} ${CHIP_VARIANT[variant]}`;
  });
  readonly comboboxClass = computed(
    () =>
      `!inline-block !w-auto ${FIELD_SIZE[this.size()]} [&]:!inline-block [&]:!w-auto [&_div.group]:!h-auto [&_div.group]:!min-h-0 [&_div.group]:!w-auto [&_div.group]:!rounded-none [&_div.group]:!border-0 [&_div.group]:!bg-transparent [&_div.group]:!px-0 [&_div.group]:!shadow-none [&_div.group]:!ring-0 [&_div.group]:![font-size:inherit] [&_input]:!h-auto [&_input]:!w-auto [&_input]:!border-0 [&_input]:!bg-transparent [&_input]:!px-0 [&_input]:!py-0 [&_input]:!text-inherit [&_input]:![font-size:inherit] [&_input]:!shadow-none [&_input]:!outline-none`,
  );
  readonly fieldWidthCh = computed(() => {
    const definitionType = this.definition().type;
    const base = this.displayValue() || this.entryTextValue() || this.resolvedPlaceholder();
    const baseLength = Math.max(1, (base || '').length);

    if (definitionType === 'email') {
      return baseLength;
    }

    return Math.min(24, baseLength + 1);
  });
  readonly dateFieldWidthCh = computed(() => {
    const width = this.fieldWidthCh();
    return width < 10 ? 10 : width;
  });

  constructor() {
    this.comboboxControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => {
      this.emitValue(v);

      if (this.isEditing() && this.definition().type === 'combobox' && v != null && v !== '') {
        this.closeEdit();
        this.tabFromField.emit();
      }
    });

    this.selectControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => {
      this.emitValue(v ?? null);
      if (this.isEditing() && v != null && v !== '') {
        this.closeEdit();
        this.tabFromField.emit();
      }
    });

    this.selectMultipleControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        this.emitValue(Array.isArray(v) ? v : []);
      });

    effect(() => {
      this.comboboxControl.setValue(this.entry().value, { emitEvent: false });
    });

    effect(() => {
      if (this.definition().type === 'select') {
        this.selectControl.setValue(this.entry().value ?? null, { emitEvent: false });
      }
    });

    effect(() => {
      if (this.definition().type === 'selectMultiple') {
        const v = this.entry().value;
        this.selectMultipleControl.setValue(Array.isArray(v) ? v : [], { emitEvent: false });
      }
    });

    effect(() => {
      if (this.autoOpen()) {
        queueMicrotask(() => this.openEdit());
      }
    });

    effect((onCleanup) => {
      const factory = this.definition().resourceFactory;
      let canceled = false;
      let created: FilterOptionsResource | null = null;

      this.resourceRef.set(null);

      if (!factory) {
        onCleanup(() => {
          canceled = true;
        });
        return;
      }

      queueMicrotask(() => {
        if (canceled) return;

        const resource = runInInjectionContext(this.injector, () => factory(this.valuesSignal));

        if (canceled) {
          if (isDestroyable(resource)) resource.destroy();
          return;
        }

        created = resource;
        this.resourceRef.set(resource);
      });

      onCleanup(() => {
        canceled = true;
        if (created && isDestroyable(created)) created.destroy();
      });
    });
  }

  private emitValue(value: unknown) {
    this.valueChange.emit({ entryId: this.entry().id, value });
  }

  private openDatePopover(attempt = 0) {
    const wrapper = this.fieldRef()?.nativeElement;
    const calendarHost = wrapper?.querySelector('app-input-calendar') as HTMLElement | null;

    if (!calendarHost) {
      if (attempt < 10) {
        requestAnimationFrame(() => this.openDatePopover(attempt + 1));
      }
      return;
    }

    const open = () => {
      const currentHost = this.fieldRef()?.nativeElement.querySelector(
        'app-input-calendar',
      ) as HTMLElement | null;

      if (!currentHost) {
        if (attempt < 10) {
          requestAnimationFrame(() => this.openDatePopover(attempt + 1));
        }
        return;
      }

      const calendarHost = currentHost;
      const calendarInput = calendarHost?.querySelector(
        ':scope > div.relative > input',
      ) as HTMLInputElement | null;
      const calendarPopover = calendarHost?.querySelector(':scope > [popover]') as
        | (HTMLElement & { showPopover?: () => void })
        | null;

      calendarInput?.focus();

      if (calendarPopover?.showPopover) {
        try {
          calendarPopover.showPopover();
          queueMicrotask(() => calendarInput?.focus());
          return;
        } catch {}
      }

      calendarInput?.click();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(open);
    });
  }

  openEdit() {
    if (this.isEditing()) {
      return;
    }

    this.isEditing.set(true);

    setTimeout(() => {
      const wrapper = this.fieldRef()?.nativeElement;
      const first = wrapper?.querySelector<HTMLElement>('input, select, button[type=button]');
      first?.focus();

      const type = this.definition().type;

      if (type === 'select' || type === 'selectMultiple') {
        const btn = wrapper?.querySelector<HTMLButtonElement>('app-select button');
        btn?.click();
      }

      if (type === 'combobox') {
        const comboInput = wrapper?.querySelector('app-combobox input') as HTMLInputElement | null;
        comboInput?.click();
      }

      if (type === 'date') {
        this.openDatePopover();
      }

      if (first instanceof HTMLInputElement) {
        first.select();
      }
    });
  }

  closeEdit() {
    this.isEditing.set(false);
  }

  onChipKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openEdit();
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.removeCurrent();
    }
  }

  onFieldKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeEdit();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      this.closeEdit();
      this.tabFromField.emit();
    }
  }

  onDateChange(value?: string) {
    this.emitValue(value || null);
  }

  onTextChange(value: string) {
    this.emitValue(value.trim() || null);
  }

  removeCurrent() {
    this.remove.emit(this.entry().id);
  }

  onDocumentPointerDown(event: PointerEvent) {
    if (!this.isEditing()) return;
    if (!(event.target instanceof Node)) return;
    if (!this.elementRef.nativeElement.contains(event.target)) this.closeEdit();
  }
}
