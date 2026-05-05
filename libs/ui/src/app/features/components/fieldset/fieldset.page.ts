import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Section } from '../../../core/components/section';
import { Fieldset } from '../../../shared/components/fieldset/fieldset';
import { Input } from '../../../shared/components/input-field/input';
import { Tabs } from '../../../shared/components/tabs';
import { ValidatorHint } from '../../../shared/components/validator/validator-hint';

@Component({
  selector: 'app-fieldset-page',
  templateUrl: './fieldset.page.html',
  imports: [Section, Tabs, ReactiveFormsModule, Fieldset, Input, ValidatorHint],
})
export class FieldsetPage {
  readonly emailControl = new FormControl<string>('', [Validators.required, Validators.email]);
}
