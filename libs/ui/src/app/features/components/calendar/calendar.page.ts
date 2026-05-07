import { Component, signal } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Calendar } from '../../../shared/components/calendar/calendar';
import { InputCalendar } from '../../../shared/components/calendar/input-calendar';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar.page.html',
  imports: [Section, Tabs, Calendar, InputCalendar],
})
export class CalendarPage {
  inputDateValue = signal<string>('2026-01-01');
  inputDateTimeValue = signal<string>('2026-01-01T14:30');
  inputMonthValue = signal<string>('2026-01');
  inputDateRangeValue = signal<string>('2026-01-10/2026-01-20');
}
