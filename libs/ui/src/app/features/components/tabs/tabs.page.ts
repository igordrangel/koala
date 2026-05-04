import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs.page.html',
  imports: [Section, Tabs],
})
export class TabsPage {}
