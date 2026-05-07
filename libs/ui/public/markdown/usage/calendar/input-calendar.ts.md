```typescript
import { Component, signal } from '@angular/core';
import { InputCalendar } from '@/shared/components/calendar/input-calendar';

@Component({
  selector: 'app-tooltip-sample',
  templateUrl: './tooltip.sample.html',
  imports: [InputCalendar],
})
export class CalendarSample {
  inputDateValue = signal<string>('2026-01-01');
  inputDateTimeValue = signal<string>('2026-01-01T14:30');
  inputMonthValue = signal<string>('2026-01');
  inputDateRangeValue = signal<string>('2026-01-10/2026-01-20');
}
```
