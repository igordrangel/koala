import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Combobox, ComboboxOption, ComboboxResourceFactory } from '../../../../combobox/combobox';
import { Select } from '../../../../select/select';

type SelectFieldType = 'combobox' | 'select' | 'selectMultiple';

@Component({
  selector: 'app-filter-entry-select-field',
  templateUrl: './select-field.html',
  imports: [ReactiveFormsModule, Combobox, Select],
})
export class FilterEntrySelectFieldComponent {
  readonly type = input.required<SelectFieldType>();
  readonly options = input<ComboboxOption[]>([]);
  readonly placeholder = input.required<string>();
  readonly fieldWidthCh = input.required<number>();
  readonly comboboxClass = input.required<string>();
  readonly resourceFactory = input<ComboboxResourceFactory<unknown> | undefined>(undefined);
  readonly comboboxControl = input.required<FormControl<unknown>>();
  readonly selectControl = input.required<FormControl<unknown>>();
  readonly selectMultipleControl = input.required<FormControl<unknown>>();

  readonly optionSelected = output<ComboboxOption>();
}
