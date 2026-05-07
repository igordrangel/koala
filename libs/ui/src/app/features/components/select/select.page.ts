import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Section } from '../../../core/components/section';
import {
  Select,
  SelectOption,
} from '../../../shared/components/select/select';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-select-page',
  templateUrl: './select.page.html',
  imports: [ReactiveFormsModule, JsonPipe, Section, Tabs, Select],
})
export class SelectPage {
  readonly singleControl = new FormControl<string | null>(null);
  readonly multipleControl = new FormControl<string[]>([], { nonNullable: true });

  readonly options: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ];
}
