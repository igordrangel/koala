import { Component, input } from '@angular/core';
import { InlineFilterField } from '../../config';
import { InlineFilterInput } from '../fields/input/inline-filter-input';

@Component({
  selector: 'app-input-filter-edit',
  templateUrl: './input-filter-edit.html',
  imports: [InlineFilterInput],
})
export class InputFilterEdit {
  readonly field = input.required<InlineFilterField>();
}
