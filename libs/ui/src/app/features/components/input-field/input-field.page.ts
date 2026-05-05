import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Input } from '../../../shared/components/input-field/input';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-input-field-page',
  templateUrl: './input-field.page.html',
  imports: [Section, Tabs, Input],
})
export class InputFieldPage {}
