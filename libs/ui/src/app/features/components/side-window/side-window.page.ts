import { Button } from '@/shared/components/button/button';
import { SideWindow, SideWindowConfig } from '@/shared/components/side-window/side-window';
import { Tabs } from '@/shared/components/tabs';
import { Component, inject } from '@angular/core';
import { Section } from '../../../core/components/section';
import { SideWindowSample } from './side-window-sample';

@Component({
  selector: 'app-side-window-page',
  templateUrl: './side-window.page.html',
  imports: [Section, Button, Tabs],
})
export class SideWindowPage {
  private readonly sideWindow = inject(SideWindow);

  open(closeOptions: SideWindowConfig['closeOptions'], closeButtonCorner = false) {
    this.sideWindow.open(SideWindowSample, { closeOptions, data: { closeButtonCorner } });
  }
}
