import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  { path: 'button', loadComponent: () => import('./button/button.page').then((m) => m.ButtonPage) },
  {
    path: 'loading',
    loadComponent: () => import('./loading/loading.page').then((m) => m.LoadingPage),
  },
  {
    path: 'dropdown',
    loadComponent: () => import('./dropdown/dropdown.page').then((m) => m.DropdownPage),
  },
  {
    path: 'modal',
    loadComponent: () => import('./modal/modal.page').then((m) => m.ModalPage),
  },
  {
    path: 'side-window',
    loadComponent: () => import('./side-window/side-window.page').then((m) => m.SideWindowPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./tooltip/tooltip.page').then((m) => m.TooltipPage),
  },
  {
    path: 'stepper',
    loadComponent: () => import('./stepper/stepper.page').then((m) => m.StepperPage),
  },
  {
    path: 'collapse',
    loadComponent: () => import('./collapse/collapse.page').then((m) => m.CollapsePage),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./confirm/confirm.page').then((m) => m.ConfirmPage),
  },
  {
    path: 'alert',
    loadComponent: () => import('./alert/alert.page').then((m) => m.AlertPage),
  },
  {
    path: 'toast',
    loadComponent: () => import('./toast/toast.page').then((m) => m.ToastPage),
  },
  {
    path: 'table',
    loadComponent: () => import('./table/table.page').then((m) => m.TablePage),
  },
  {
    path: 'skeleton',
    loadComponent: () => import('./skeleton/skeleton.page').then((m) => m.SkeletonPage),
  },
  {
    path: 'pagination',
    loadComponent: () => import('./pagination/pagination.page').then((m) => m.PaginationPage),
  },
  {
    path: 'breadcrumb',
    loadComponent: () => import('./breadcrumb/breadcrumb.page').then((m) => m.BreadcrumbPage),
  },
  {
    path: 'fieldset',
    loadComponent: () => import('./fieldset/fieldset.page').then((m) => m.FieldsetPage),
  },
  {
    path: 'input-field',
    loadComponent: () => import('./input-field/input-field.page').then((m) => m.InputFieldPage),
  },
  {
    path: 'input-cpf',
    loadComponent: () => import('./input-cpf/input-cpf.page').then((m) => m.InputCpfPage),
  },
  {
    path: 'input-cnpj',
    loadComponent: () => import('./input-cnpj/input-cnpj.page').then((m) => m.InputCnpjPage),
  },
  {
    path: 'input-currency',
    loadComponent: () =>
      import('./input-currency/input-currency.page').then((m) => m.InputCurrencyPage),
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./checkbox/checkbox.page').then((m) => m.CheckboxPage),
  },
  {
    path: 'radio',
    loadComponent: () => import('./radio/radio.page').then((m) => m.RadioPage),
  },
  {
    path: 'toggle',
    loadComponent: () => import('./toggle/toggle.page').then((m) => m.TogglePage),
  },
  {
    path: 'range',
    loadComponent: () => import('./range/range.page').then((m) => m.RangePage),
  },
  {
    path: 'select',
    loadComponent: () => import('./select/select.page').then((m) => m.SelectPage),
  },
  {
    path: 'validator',
    loadComponent: () => import('./validator/validator.page').then((m) => m.ValidatorPage),
  },
  {
    path: 'textarea',
    loadComponent: () => import('./textarea/textarea.page').then((m) => m.TextareaPage),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.page').then((m) => m.CalendarPage),
  },
];
