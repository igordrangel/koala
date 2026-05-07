import { Component, input, output } from '@angular/core';
import { InputCalendar } from '../../../../calendar/input-calendar';

@Component({
  selector: 'app-filter-entry-date-field',
  templateUrl: './date-field.html',
  imports: [InputCalendar],
})
export class FilterEntryDateFieldComponent {
  readonly widthCh = input.required<number>();
  readonly value = input.required<string>();
  readonly placeholder = input.required<string>();

  readonly dateChange = output<string | undefined>();
}
