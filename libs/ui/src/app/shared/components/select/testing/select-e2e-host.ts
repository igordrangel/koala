import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select, SelectOption } from '../select';

@Component({
  selector: 'app-select-e2e-host',
  templateUrl: './select-e2e-host.html',
  imports: [JsonPipe, ReactiveFormsModule, Select],
})
export class SelectE2EHostComponent {
  readonly statusOutsideControl = new FormControl<string | null>(null);
  readonly statusInsideDialogControl = new FormControl<string | null>(null);
  readonly labelsControl = new FormControl<string[]>([], { nonNullable: true });

  readonly statusOptions: SelectOption[] = [
    { value: 'open', label: 'Open', data: undefined },
    { value: 'closed', label: 'Closed', data: undefined },
    { value: 'draft', label: 'Draft', data: undefined },
  ];

  readonly labelOptions: SelectOption[] = [
    { value: 'frontend', label: 'Frontend', data: undefined },
    { value: 'backend', label: 'Backend', data: undefined },
    { value: 'docs', label: 'Documentation', data: undefined },
  ];
}
