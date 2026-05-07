import { Routes } from '@angular/router';

export const routes: Routes = [
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
];
