import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { InlineFilterField } from '../../config';
import { InlineFilterCalendar } from '../fields/calendar/inline-filter-calendar';
import { InlineFilterCombobox } from '../fields/combobox/inline-filter-combobox';
import { InlineFilterInput } from '../fields/input/inline-filter-input';
import { InlineFilterSelect } from '../fields/select/inline-filter-select';

@Component({
  selector: 'app-input-filter-edit',
  templateUrl: './input-filter-edit.html',
  imports: [InlineFilterInput, InlineFilterSelect, InlineFilterCombobox, InlineFilterCalendar],
})
export class InputFilterEdit implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly closeOutsideClick = (event: PointerEvent) => {
    const contentElement = this.elementRef.nativeElement;
    const clickElement = event.target as HTMLElement;

    if (contentElement && !contentElement.contains(clickElement)) {
      this.exitEditMode.emit();
    }
  };

  readonly field = input.required<InlineFilterField>();
  readonly invalid = signal(false);
  readonly exitEditMode = output<void>();

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeOutsideClick);
  }

  ngOnInit(): void {
    document.addEventListener('click', this.closeOutsideClick);
  }
}
