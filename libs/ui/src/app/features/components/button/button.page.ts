import { Component } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { Section } from '../../../core/components/section';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-button-page',
  templateUrl: './button.page.html',
  imports: [Section, Button, Tabs],
})
export class ButtonPage {}
