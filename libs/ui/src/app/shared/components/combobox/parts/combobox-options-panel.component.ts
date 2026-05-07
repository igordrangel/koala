import { Component, computed, input, output } from '@angular/core';
import { Listbox as AriaListbox, Option as AriaOption } from '@angular/aria/listbox';
import { ComboboxOption } from '../combobox';
import { isSameComboboxValue } from '../helpers';

@Component({
  selector: 'app-combobox-options-panel',
  templateUrl: './combobox-options-panel.component.html',
  imports: [AriaListbox, AriaOption],
})
export class ComboboxOptionsPanelComponent {
  readonly isLoading = input(false);
  readonly searchingMessage = input('Searching...');
  readonly filterValue = input('');
  readonly showEmptyState = input(false);
  readonly emptyMessage = input('No records found');
  readonly options = input<ComboboxOption[]>([]);
  readonly activeIndex = input(-1);
  readonly multiple = input(false);
  readonly selectedOption = input<ComboboxOption | null>(null);
  readonly selectedOptions = input<ComboboxOption[]>([]);

  readonly selectOption = output<ComboboxOption>();

  readonly headerMessage = computed(() => {
    const filter = this.filterValue();
    return filter ? `Results for "${filter}"` : 'Select an option';
  });

  isOptionSelected(optionValue: unknown): boolean {
    if (this.multiple()) {
      return this.selectedOptions().some((selected) =>
        isSameComboboxValue(selected.value, optionValue),
      );
    }

    return isSameComboboxValue(this.selectedOption()?.value, optionValue);
  }
}
