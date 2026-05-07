import { effect, ElementRef } from '@angular/core';
import { KlDate } from '@koalarx/utils/light/KlDate';
import type { CalendarType } from '../calendar';

interface SetupCalendarChangeEffectParams {
  calendar: () => ElementRef<HTMLElement & { value?: string }> | undefined;
  type: () => CalendarType;
  emitSelectedDate: (date: KlDate) => void;
  emitSelectedRange: (value: string) => void;
}

export function setupCalendarChangeEffect(params: SetupCalendarChangeEffectParams): void {
  const onDateChange = (event: CustomEvent<Date>) => {
    if (params.type() !== 'date') {
      return;
    }

    const date = new KlDate(event.detail);
    date.add(1, 'days').setHours(0, 0, 0, 0);
    params.emitSelectedDate(date);
  };

  const onRangeChange = (event: Event) => {
    if (params.type() !== 'daterange') {
      return;
    }

    const value = (event.target as HTMLInputElement | null)?.value;

    if (value) {
      params.emitSelectedRange(value);
    }
  };

  effect((onCleanup) => {
    const calendar = params.calendar()?.nativeElement;

    if (!calendar) {
      return;
    }

    if (params.type() === 'daterange') {
      const handler = onRangeChange as EventListener;
      calendar.addEventListener('change', handler);
      onCleanup(() => calendar.removeEventListener('change', handler));
      return;
    }

    const handler = onDateChange as EventListener;
    calendar.addEventListener('focusday', handler);
    onCleanup(() => calendar.removeEventListener('focusday', handler));
  });
}
