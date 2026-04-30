import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Button } from '../../../shared/components/button/button';
import { Dropdown } from '../../../shared/components/dropdown';
import { Tabs } from '../../../shared/components/tabs';

@Component({
  selector: 'app-dropdown-page',
  templateUrl: './dropdown.page.html',
  imports: [Dropdown, Section, Button, Tabs],
})
export class DropdownPage {}
