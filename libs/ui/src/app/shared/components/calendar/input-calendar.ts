import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { KlDate } from '@koalarx/utils/light/KlDate';
import 'cally';
import { Input } from '../input-field/input';
import { Mask } from '../../directives/mask.directive';
import { Calendar } from './calendar';
import {
  createMonthOptions,
  getDatePart,
  getDisplayValue,
  getInputMask,
  parseInputValue,
  getTimePart,
  toSelectedDateValue,
} from './input-calendar.helpers';
import { InputCalendarMonthPickerComponent } from './parts/input-calendar-month-picker.component';
import { InputCalendarTimeRowComponent } from './parts/input-calendar-time-row.component';
import {
  setupMonthDisplayYearEffect,
} from './effects/setup-input-calendar-effects';
import { InputCalendarFormat, InputCalendarType } from './input-calendar.types';

export type { InputCalendarFormat, InputCalendarType } from './input-calendar.types';

@Component({
  selector: 'app-input-calendar',
  templateUrl: './input-calendar.html',
  styleUrls: ['./input-calendar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Calendar, InputCalendarMonthPickerComponent, InputCalendarTimeRowComponent, Input, Mask],
})
export class InputCalendar {
  private readonly textInput = viewChild<ElementRef<HTMLInputElement>>('textInput');
  private readonly popover = viewChild<ElementRef<HTMLElement>>('popover');

  readonly id = `input-calendar-${Math.random().toString(16).slice(2)}`;
  readonly popoverId = `input-calendar-popover-${Math.random().toString(16).slice(2)}`;
  readonly format = input<InputCalendarFormat>('dd/MM/yyyy');
  readonly type = input<InputCalendarType>('date');

  readonly value = model<string>('');
  readonly placeholder = input<string>('Pick a date');
  readonly inputValue = signal<string>('');
  readonly inputMask = computed(() => getInputMask(this.type(), this.format()));
  readonly timeValue = computed(() => getTimePart(this.value()));
  readonly displayedYear = signal<number>(new Date().getFullYear());
  readonly monthOptions = createMonthOptions('pt-BR');

  constructor() {
    effect(() => {
      this.inputValue.set(getDisplayValue(this.value(), this.type(), this.format()));
    });

    setupMonthDisplayYearEffect({
      type: this.type,
      value: this.value,
      setDisplayedYear: (year) => this.displayedYear.set(year),
    });
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const rawValue = input?.value ?? '';
    this.inputValue.set(rawValue);

    const parsedValue = parseInputValue(rawValue, this.type(), this.format());

    if (parsedValue === undefined) {
      return;
    }

    this.value.set(parsedValue);
  }

  openPopover() {
    const popoverElement = this.popover()?.nativeElement as (HTMLElement & { showPopover?: () => void }) | undefined;

    if (!popoverElement || !popoverElement.showPopover) {
      return;
    }

    popoverElement.showPopover();
  }

  setDateValue(value: KlDate) {
    this.value.set(toSelectedDateValue(value, this.type(), this.value()));
  }

  setRangeValue(value: string) {
    this.value.set(value);
  }

  changeDisplayedYear(step: number) {
    this.displayedYear.update((value) => value + step);
  }

  setMonthValue(month: number) {
    const parsedMonth = String(month + 1).padStart(2, '0');
    this.value.set(`${this.displayedYear()}-${parsedMonth}`);
  }

  setTimeValue(value: string) {
    if (this.type() !== 'datetime') {
      return;
    }

    const dateValue = getDatePart(this.value()) || new KlDate(new Date()).format('yyyy-MM-dd');

    this.value.set(`${dateValue}T${value}`);
  }

  clear(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.value.set('');
    this.inputValue.set('');
    this.textInput()?.nativeElement.focus();
  }
}
