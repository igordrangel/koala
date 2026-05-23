import { Component, effect, OnInit, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputCalendar } from '../../../../calendar/input-calendar';
import { FieldBase } from '../field.base';
import { KlDate } from '@koalarx/utils/light/KlDate';

@Component({
  selector: 'app-inline-filter-calendar',
  templateUrl: './inline-filter-calendar.html',
  imports: [ReactiveFormsModule, InputCalendar],
})
export class InlineFilterCalendar extends FieldBase implements OnInit {
  private readonly calendarComponentRef = viewChild<InputCalendar>('calendarField');

  constructor() {
    super();

    effect(() => {
      const value = this.value();

      if (this.valueControl.invalid) {
        return;
      }

      if (value) {
        this.templateValue.set(new KlDate(`${value}T00:00:00`).format('dd/MM/yyyy'));
      } else {
        this.templateValue.set('');
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.calendarComponentRef()?.openPopover();
    });
  }
}
