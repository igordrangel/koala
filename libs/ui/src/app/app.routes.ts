import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'e2e/select',
    loadComponent: () =>
      import('./shared/components/select/testing/select-e2e-host').then(
        (m) => m.SelectE2EHostComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'get-started/introduction',
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    redirectTo: 'get-started/introduction',
    pathMatch: 'full',
  },
  {
    path: 'components',
    redirectTo: 'components/button',
    pathMatch: 'full',
  },
  {
    path: 'blocks',
    redirectTo: 'blocks/datatable',
    pathMatch: 'full',
  },
  {
    path: 'resources',
    redirectTo: 'resources/list-base',
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    loadChildren: () => import('./features/get-started/routes').then((m) => m.ROUTES),
  },
  {
    path: 'components',
    loadChildren: () => import('./features/components/routes').then((m) => m.ROUTES),
  },
  {
    path: 'blocks',
    loadChildren: () => import('./features/blocks/routes').then((m) => m.ROUTES),
  },
  {
    path: 'resources',
    loadChildren: () => import('./features/resources/routes').then((m) => m.ROUTES),
  },
];
