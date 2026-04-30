import { Component } from '@angular/core';
import { Loading } from '../../../shared/components/loading/loading';
import { Tabs } from '../../../shared/components/tabs';
import { Section } from '../../../core/components/section';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading.page.html',
  imports: [Section, Tabs, Loading],
})
export class LoadingPage {}
