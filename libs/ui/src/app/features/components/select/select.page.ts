import { Tabs } from '@/shared/components/tabs';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Section } from '../../../core/components/section';
import { Select } from '../../../shared/components/select/select';

@Component({
  selector: 'app-select-page',
  templateUrl: './select.page.html',
  imports: [ReactiveFormsModule, Section, Tabs, Select],
})
export class SelectPage {
  selectControl = new FormControl<string>('');
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
}
