import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Combobox, ComboboxOption } from '../combobox';

@Component({
  selector: 'app-combobox-e2e-host',
  templateUrl: './combobox-e2e-host.html',
  imports: [JsonPipe, ReactiveFormsModule, Combobox],
})
export class ComboboxE2EHostComponent {
  readonly assigneeControl = new FormControl<number | null>(null);
  readonly labelsControl = new FormControl<string[]>([], { nonNullable: true });

  readonly assigneeOptions: ComboboxOption<number>[] = [
    { value: 1, label: 'Emily Johnson' },
    { value: 2, label: 'Michael Brown' },
    { value: 3, label: 'Sophia Smith' },
  ];

  readonly labelOptions: ComboboxOption<string>[] = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'design-system', label: 'Design System' },
  ];
}
