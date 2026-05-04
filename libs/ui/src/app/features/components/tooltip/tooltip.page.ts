import { Button } from '@/shared/components/button/button';
import { Tabs } from '@/shared/components/tabs';
import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Tooltip } from '@/shared/components/tooltip/tooltip';

@Component({
  selector: 'app-tooltip-page',
  templateUrl: './tooltip.page.html',
  imports: [Section, Button, Tooltip, Tabs],
})
export class TooltipPage {}
