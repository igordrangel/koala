import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { KlDate } from '@koalarx/utils/light/KlDate';
import 'cally';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Calendar {
  private readonly calendar = viewChild<ElementRef>('calendar');
  private readonly onDateChange = (event: CustomEvent<Date>) => {
    const date = new KlDate(event.detail);
    date.add(1, 'days').setHours(0, 0, 0, 0);
    this.selectedDate.emit(date);
  };

  readonly value = input<string>();
  readonly selectedDate = output<KlDate>();

  constructor() {
    effect(() => {
      this.calendar()?.nativeElement.addEventListener('focusday', this.onDateChange);
    });
  }
}
