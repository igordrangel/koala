import { Button } from '@/shared/components/button/button';
import { Component, input, output } from '@angular/core';
import { InlineFilterConfig } from './config';
import { InputPicker } from './parts/picker/input-picker';

@Component({
  selector: 'app-inline-filter',
  templateUrl: './wrapper.html',
  imports: [InputPicker, Button],
})
export class Wrapper {
  protected readonly isMobile = window.innerWidth < 768;

  readonly config = input.required<InlineFilterConfig>();
  readonly placeholder = input('Type to filter');

  readonly payload = output<any>();
}
