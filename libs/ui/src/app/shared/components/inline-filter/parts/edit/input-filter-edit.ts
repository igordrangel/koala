import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { InlineFilterField } from '../../config';
import { InlineFilterCalendar } from '../fields/calendar/inline-filter-calendar';
import { InlineFilterCombobox } from '../fields/combobox/inline-filter-combobox';
import { InlineFilterInput } from '../fields/input/inline-filter-input';
import { InlineFilterSelect } from '../fields/select/inline-filter-select';

@Component({
  selector: 'app-input-filter-edit',
  templateUrl: './input-filter-edit.html',
  imports: [InlineFilterInput, InlineFilterSelect, InlineFilterCombobox, InlineFilterCalendar],
  host: {
    class: 'block',
    '(document:click)': 'closeOutsideClick($event)',
    '(keyup)': 'onKeyUp($event)',
  },
})
export class InputFilterEdit {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly closeOutsideClick = (event: PointerEvent) => {
    const contentElement = this.elementRef.nativeElement;
    const clickElement = event.target as HTMLElement;

    if (contentElement && !contentElement.contains(clickElement)) {
      this.exitEditMode.emit();
    }
  };

  protected readonly onKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Tab': {
        setTimeout(() => this.exitEditMode.emit());
        break;
      }
      case 'Enter': {
        if (this.field().multiple) {
          return;
        }

        setTimeout(() => this.exitEditMode.emit());
        break;
      }
      case 'Escape': {
        setTimeout(() => this.cancelEdit.emit());
        break;
      }
      default:
        break;
    }
  };

  readonly field = input.required<InlineFilterField>();
  readonly invalid = signal(false);
  readonly cancelEdit = output<void>();
  readonly exitEditMode = output<void>();
}
