```typescript
import { Component, signal } from '@angular/core';
import { InputCalendar } from '@/shared/components/calendar/input-calendar';

@Component({
  selector: 'app-tooltip-sample',
  templateUrl: './tooltip.sample.html',
  imports: [InputCalendar],
})
export class CalendarSample {
  inputValue = signal<string>('2026-01-01');
}
```
