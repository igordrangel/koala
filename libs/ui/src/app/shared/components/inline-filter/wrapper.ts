import { Component, input, output } from '@angular/core';
import { InputPicker } from './parts/picker/input-picker';
import { InlineFilterConfig } from './config';
import { Button } from '@/shared/components/button/button';

@Component({
  selector: 'app-inline-filter',
  templateUrl: './wrapper.html',
  imports: [InputPicker, Button],
})
export class Wrapper {
  protected readonly isMobile = window.innerWidth < 768;

  readonly config = input.required<InlineFilterConfig>();
  readonly placeholder = input('Type to filter');

  readonly appliedFilters = output<any>();
}
