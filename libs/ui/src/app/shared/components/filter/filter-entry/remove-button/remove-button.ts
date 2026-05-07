import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-entry-remove-button',
  templateUrl: './remove-button.html',
})
export class FilterEntryRemoveButtonComponent {
  readonly removeLabel = input.required<string>();
  readonly remove = output<void>();
}
