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
];
