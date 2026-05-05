import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { InputField } from '../../../shared/components/input-field';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-input-field-page',
  templateUrl: './input-field.page.html',
  imports: [Section, Tabs, InputField],
})
export class InputFieldPage {}
