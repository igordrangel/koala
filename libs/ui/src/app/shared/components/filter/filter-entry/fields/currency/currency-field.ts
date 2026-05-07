import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMask } from '../../../../../directives/currency.directive';
import { Input } from '../../../../input-field/input';

@Component({
  selector: 'app-filter-entry-currency-field',
  templateUrl: './currency-field.html',
  imports: [ReactiveFormsModule, Input, CurrencyMask],
})
export class FilterEntryCurrencyFieldComponent {
  readonly fieldWidthCh = input.required<number>();
  readonly placeholder = input.required<string>();
  readonly prefix = input<string | undefined>(undefined);
  readonly decimalDigits = input<string | undefined>(undefined);
  readonly thousandSeparator = input<string | undefined>(undefined);
  readonly decimalSeparator = input<string | undefined>(undefined);
  readonly control = input.required<FormControl<number | null>>();

  readonly inputChange = output<string>();
}
