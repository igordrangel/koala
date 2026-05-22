import { Component, input, output } from '@angular/core';
import { InlineFilterField } from '../../config';

@Component({
  selector: 'app-input-filter-chip',
  templateUrl: './input-filter-chip.html',
})
export class InputFilterChip {
  readonly field = input.required<InlineFilterField>();
  readonly removeAction = output<void>();
}
