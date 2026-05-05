import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Breadcrumb } from '../../../shared/components/breadcrumb';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-breadcrumb-page',
  templateUrl: './breadcrumb.page.html',
  imports: [Section, Tabs, Breadcrumb],
})
export class BreadcrumbPage {}
