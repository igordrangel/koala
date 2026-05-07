import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'datatable',
    loadComponent: () => import('./datatable/datatable.page').then((m) => m.DatatablePage),
  },
];
