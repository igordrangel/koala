import { Loading } from '@/shared/components/loading/loading';
import { Component, computed, input, output } from '@angular/core';
import { ComboboxInput } from '@angular/aria/combobox';
import { ComboboxOption } from '../combobox';

@Component({
  selector: 'app-combobox-trigger',
  templateUrl: './combobox-trigger.component.html',
  imports: [ComboboxInput, Loading],
})
export class ComboboxTriggerComponent {
  readonly multiple = input(false);
  readonly selectedOptions = input<ComboboxOption[]>([]);
  readonly selectedOption = input<ComboboxOption | null>(null);
  readonly placeholder = input('Select an option');
  readonly isDisabled = input(false);
  readonly isLoading = input(false);
  readonly isOpen = input(false);
  readonly inputValue = input('');

  readonly clearSelection = output<void>();
  readonly removeTag = output<unknown>();
  readonly focusRequested = output<void>();
  readonly inputKeydown = output<KeyboardEvent>();
  readonly inputValueChange = output<string>();

  readonly hasSelection = computed(() =>
    this.multiple() ? this.selectedOptions().length > 0 : !!this.selectedOption(),
  );

  onRemoveTag(optionValue: unknown, event: MouseEvent) {
    event.stopPropagation();
    this.removeTag.emit(optionValue);
  }
}
