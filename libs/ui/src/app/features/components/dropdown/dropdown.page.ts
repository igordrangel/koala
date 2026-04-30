import { Component } from '@angular/core';
import { Dropdown } from '../../../shared/components/dropdown';
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-dropdown-page',
  templateUrl: './dropdown.page.html',
  imports: [Dropdown, Button],
})
export class DropdownPage {}
