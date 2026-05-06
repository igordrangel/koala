import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Section } from '../../../core/components/section';
import { Radio } from '../../../shared/components/radio/radio';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-radio-page',
  templateUrl: './radio.page.html',
  imports: [ReactiveFormsModule, Section, Tabs, Radio],
})
export class RadioPage {
  radioControl = new FormControl<string>('');
}
