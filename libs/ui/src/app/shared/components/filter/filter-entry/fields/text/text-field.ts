import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Mask } from '../../../../../directives/mask.directive';
import { Input, InputSize } from '../../../../input-field/input';

@Component({
  selector: 'app-filter-entry-text-field',
  templateUrl: './text-field.html',
  imports: [Input, Mask, ReactiveFormsModule],
})
export class FilterEntryTextFieldComponent {
  readonly size = input<InputSize>('sm');
  readonly fieldWidthCh = input.required<number>();
  readonly inputType = input.required<string>();
  readonly inputMode = input.required<string>();
  readonly inputMask = input<string | undefined>(undefined);
  readonly placeholder = input.required<string>();
  readonly value = input.required<string>();
  readonly validationControl = input.required<FormControl<unknown>>();

  readonly textInput = output<string>();
}
