import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Collapse } from '../../../shared/components/collapse/collapse';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-collapse-page',
  templateUrl: './collapse.page.html',
  imports: [Section, Tabs, Collapse],
})
export class CollapsePage {}
