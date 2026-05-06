import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Section } from '../../../core/components/section';
import { Input } from '../../../shared/components/input-field/input';
import { Tabs } from '../../../shared/components/tabs';
import { ValidatorHint } from '../../../shared/components/validator/validator-hint';

@Component({
  selector: 'app-validator-page',
  templateUrl: './validator.page.html',
  imports: [Section, Tabs, ReactiveFormsModule, Input, ValidatorHint],
})
export class ValidatorPage {
  readonly emailControl = new FormControl<string>('', [Validators.required, Validators.email]);
}
