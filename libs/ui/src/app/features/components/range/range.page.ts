import { Tabs } from '@/shared/components/tabs';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Section } from '../../../core/components/section';
import { Range } from '../../../shared/components/range/range';

@Component({
  selector: 'app-range-page',
  templateUrl: './range.page.html',
  imports: [ReactiveFormsModule, Section, Tabs, Range],
})
export class RangePage {
  rangeControl = new FormControl<number>(50);
}
