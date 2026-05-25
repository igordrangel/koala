import { Combobox, ComboboxField, ComboboxOptions } from '@/shared/components/combobox';
import { Component, computed, effect, OnInit, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldBase } from '../field.base';

@Component({
  selector: 'app-inline-filter-combobox',
  templateUrl: './inline-filter-combobox.html',
  imports: [ReactiveFormsModule, Combobox],
})
export class InlineFilterCombobox extends FieldBase implements OnInit {
  private readonly comboboxComponentRef = viewChild<ComboboxField>('comboboxField');

  readonly options = computed(() => this.config().options as ComboboxOptions<any, any>);

  constructor() {
    super();

    effect(() => {
      const selectedOptions = this.comboboxComponentRef()?.selectedOptions();

      if (this.valueControl.invalid) {
        return;
      }

      if (selectedOptions) {
        this.templateValue.set(selectedOptions.map((option) => option.label).join(', '));
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.comboboxComponentRef()?.inputFilterElement()?.nativeElement.focus();
      this.comboboxComponentRef()?.toggleDropdown();
    });
  }
}
