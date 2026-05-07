import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComboboxOption, ComboboxResourceFactory } from '../../../combobox/combobox';
import { FilterCurrencyConfig, FilterDefinition, FilterSize } from '../../filter.models';
import { FilterEntryCurrencyFieldComponent } from '../fields/currency/currency-field';
import { FilterEntryDateFieldComponent } from '../fields/date/date-field';
import { FilterEntrySelectFieldComponent } from '../fields/select/select-field';
import { FilterEntryTextFieldComponent } from '../fields/text/text-field';
import { FilterEntryRemoveButtonComponent } from '../remove-button/remove-button';

@Component({
  selector: 'app-filter-entry-edit',
  templateUrl: './edit.html',
  imports: [
    FilterEntryTextFieldComponent,
    FilterEntrySelectFieldComponent,
    FilterEntryCurrencyFieldComponent,
    FilterEntryDateFieldComponent,
    FilterEntryRemoveButtonComponent,
  ],
})
export class FilterEntryEditComponent implements AfterViewInit {
  private readonly fieldRef = viewChild<ElementRef<HTMLElement>>('fieldEl');

  readonly definition = input.required<FilterDefinition>();
  readonly size = input<FilterSize>('sm');
  readonly chipClass = input.required<string>();
  readonly removeLabel = input.required<string>();
  readonly resolvedPlaceholder = input.required<string>();
  readonly fieldWidthCh = input.required<number>();
  readonly dateFieldWidthCh = input.required<number>();
  readonly comboboxClass = input.required<string>();
  readonly resolvedOptions = input<ComboboxOption[]>([]);
  readonly resolvedComboboxOptions = input<ComboboxOption[]>([]);
  readonly comboboxResourceFactory = input<ComboboxResourceFactory<unknown> | undefined>(undefined);
  readonly comboboxControl = input.required<FormControl<unknown>>();
  readonly selectControl = input.required<FormControl<unknown>>();
  readonly selectMultipleControl = input.required<FormControl<unknown>>();
  readonly currencyControl = input.required<FormControl<number | null>>();
  readonly currencyConfig = input<FilterCurrencyConfig>({});
  readonly validationControl = input.required<FormControl<unknown>>();
  readonly currencyDecimalDigits = input<string | undefined>(undefined);
  readonly entryTextValue = input.required<string>();
  readonly inputType = input.required<string>();
  readonly inputMode = input.required<string>();
  readonly inputMask = input<string | undefined>(undefined);

  readonly optionSelected = output<ComboboxOption>();
  readonly dateChange = output<string | undefined>();
  readonly textValueInput = output<string>();
  readonly currencyInput = output<string>();
  readonly remove = output<void>();
  readonly fieldKeydown = output<KeyboardEvent>();

  ngAfterViewInit() {
    setTimeout(() => this.focusInitialField());
  }

  private focusInitialField() {
    const wrapper = this.fieldRef()?.nativeElement;
    const first = wrapper?.querySelector<HTMLElement>('input, select, button[type=button]');
    first?.focus();

    switch (this.definition().type) {
      case 'select':
      case 'selectMultiple':
        wrapper?.querySelector<HTMLButtonElement>('app-select button')?.click();
        break;
      case 'combobox':
        (wrapper?.querySelector('app-combobox input') as HTMLInputElement | null)?.click();
        break;
      case 'date':
        this.openDatePopover();
        break;
    }

    if (first instanceof HTMLInputElement) {
      first.select();
    }
  }

  private openDatePopover(attempt = 0) {
    const wrapper = this.fieldRef()?.nativeElement;
    const calendarHost = wrapper?.querySelector('app-input-calendar') as HTMLElement | null;

    if (!calendarHost) {
      if (attempt < 10) requestAnimationFrame(() => this.openDatePopover(attempt + 1));
      return;
    }

    const open = () => {
      const currentHost = this.fieldRef()?.nativeElement.querySelector(
        'app-input-calendar',
      ) as HTMLElement | null;

      if (!currentHost) {
        if (attempt < 10) requestAnimationFrame(() => this.openDatePopover(attempt + 1));
        return;
      }

      const calendarInput = currentHost.querySelector(
        ':scope > div.relative > input',
      ) as HTMLInputElement | null;
      const calendarPopover = currentHost.querySelector(':scope > [popover]') as
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

    requestAnimationFrame(() => requestAnimationFrame(open));
  }
}
