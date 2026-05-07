import { Component, input, output } from '@angular/core';
import { FilterDefinition, FilterI18n } from '../../filter.models';
import { FilterEntryRemoveButtonComponent } from '../remove-button/remove-button';

@Component({
  selector: 'app-filter-entry-view',
  templateUrl: './view.html',
  imports: [FilterEntryRemoveButtonComponent],
})
export class FilterEntryViewComponent {
  readonly definition = input.required<FilterDefinition>();
  readonly chipClass = input.required<string>();
  readonly displayValue = input<string | null>(null);
  readonly isRemoteValueLoading = input(false);
  readonly i18n = input.required<FilterI18n>();
  readonly removeLabel = input.required<string>();

  readonly open = output<void>();
  readonly remove = output<void>();
  readonly chipKeydown = output<KeyboardEvent>();
}
