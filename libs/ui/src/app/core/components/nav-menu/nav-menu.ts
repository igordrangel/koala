import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KlArray } from '@koalarx/utils/KlArray';

interface MenuOption {
  name: string;
  routerLink: string;
  commingSoon?: boolean;
}

interface MenuOptions {
  name: string;
  items: MenuOption[];
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.html',
  imports: [RouterLink, RouterLinkActive],
})
export class NavMenu {
  readonly getStarted = new KlArray<MenuOption>([
    { name: 'Introduction', routerLink: 'introduction' },
    { name: 'Installation', routerLink: 'installation' },
  ]).orderBy('name');

  readonly components = new KlArray<MenuOptions>([
    {
      name: 'Actions',
      items: new KlArray<MenuOption>([
        { name: 'Button', routerLink: 'components/button' },
        { name: 'Confirm', routerLink: 'components/confirm' },
        { name: 'Dropdown', routerLink: 'components/dropdown' },
        { name: 'Modal', routerLink: 'components/modal' },
        { name: 'Side Window', routerLink: 'components/side-window' },
      ]).orderBy('name'),
    },
    {
      name: 'Data Display',
      items: new KlArray<MenuOption>([
        { name: 'Collapse', routerLink: 'components/collapse' },
        { name: 'Datatable', routerLink: 'components/datatable', commingSoon: true },
        { name: 'Table', routerLink: 'components/table' },
      ]).orderBy('name'),
    },
    {
      name: 'Navigation',
      items: new KlArray<MenuOption>([
        { name: 'Breadcrumb', routerLink: 'components/breadcrumb' },
        { name: 'Stepper', routerLink: 'components/stepper' },
        { name: 'Tab', routerLink: 'components/tabs' },
        { name: 'Pagination', routerLink: 'components/pagination' },
      ]).orderBy('name'),
    },
    {
      name: 'Feedback',
      items: new KlArray<MenuOption>([
        { name: 'Alert', routerLink: 'components/alert' },
        { name: 'Loading', routerLink: 'components/loading' },
        { name: 'Toast', routerLink: 'components/toast' },
        { name: 'Tooltip', routerLink: 'components/tooltip' },
        { name: 'Skeleton', routerLink: 'components/skeleton' },
      ]).orderBy('name'),
    },
    {
      name: 'Data Input',
      items: new KlArray<MenuOption>([
        { name: 'CNPJ', routerLink: 'components/input-cnpj', commingSoon: true },
        { name: 'CPF', routerLink: 'components/input-cpf', commingSoon: true },
        { name: 'Checkbox', routerLink: 'components/input-checkbox', commingSoon: true },
        { name: 'Currency', routerLink: 'components/input-currency', commingSoon: true },
        { name: 'Calendar', routerLink: 'components/input-date', commingSoon: true },
        { name: 'Radio', routerLink: 'components/input-radio', commingSoon: true },
        { name: 'Range', routerLink: 'components/input-range', commingSoon: true },
        { name: 'Select', routerLink: 'components/select', commingSoon: true },
        { name: 'Combobox', routerLink: 'components/combobox', commingSoon: true },
        { name: 'Toggle', routerLink: 'components/toggle', commingSoon: true },
        { name: 'Textarea', routerLink: 'components/textarea' },
        { name: 'Filter', routerLink: 'components/filter', commingSoon: true },
        { name: 'Input Field', routerLink: 'components/input-field' },
        { name: 'Validator', routerLink: 'components/validator' },
        { name: 'Fieldset', routerLink: 'components/fieldset' },
      ]).orderBy('name'),
    },
  ]).orderBy('name');

  readonly resources = new KlArray<MenuOptions>([
    {
      name: 'Abstractions',
      items: new KlArray<MenuOption>([
        { name: 'HttpBase', routerLink: 'resources/http-base', commingSoon: true },
        { name: 'ListBase', routerLink: 'resources/list-base', commingSoon: true },
        { name: 'FormBase', routerLink: 'resources/form-base', commingSoon: true },
        { name: 'PageBase', routerLink: 'resources/page-base', commingSoon: true },
      ]).orderBy('name'),
    },
    {
      name: 'Others',
      items: new KlArray<MenuOption>([
        { name: 'Global Errors', routerLink: 'resources/global-errors', commingSoon: true },
      ]).orderBy('name'),
    },
    {
      name: 'Security & Policies',
      items: new KlArray<MenuOption>([
        { name: 'Auth', routerLink: 'resources/auth', commingSoon: true },
        { name: 'Rules', routerLink: 'resources/rules', commingSoon: true },
        { name: 'Global Errors', routerLink: 'resources/global-errors', commingSoon: true },
      ]).orderBy('name'),
    },
  ]).orderBy('name');
}
