import { Component, effect, ElementRef, input, model, viewChild } from '@angular/core';
import { KlDate } from '@koalarx/utils/light/KlDate';
import 'cally';
import { Calendar } from './calendar';

export type InputCalendarFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy/MM/dd';

@Component({
  selector: 'app-input-calendar',
  templateUrl: './input-calendar.html',
  imports: [Calendar],
})
export class InputCalendar {
  private readonly datePicker = viewChild<ElementRef<HTMLButtonElement>>('datePickerInput');

  readonly id = `input-calendar-${Math.random().toString(16).slice(2)}`;
  readonly popoverId = `input-calendar-popover-${Math.random().toString(16).slice(2)}`;
  readonly format = input<InputCalendarFormat>('dd/MM/yyyy');

  readonly value = model<string>();
  readonly placeholder = input<string>('Pick a date');

  constructor() {
    effect(() => {
      const value = this.value();
      const datePicker = this.datePicker();

      if (!datePicker) {
        return;
      }

      const input = datePicker.nativeElement.querySelector('span')!;

      input.classList.remove('opacity-60');

      if (!value) {
        input.innerText = this.placeholder();
        input.classList.add('opacity-60');
        return;
      }

      const dateValue = new KlDate(`${value}T00:00:00`);

      input.innerText = dateValue.format(this.format());
    });
  }

  setValue(value: KlDate) {
    this.value.set(value.format('yyyy-MM-dd'));
  }

  clear(event: Event) {
    event.preventDefault();
    this.value.set('');
  }
}
