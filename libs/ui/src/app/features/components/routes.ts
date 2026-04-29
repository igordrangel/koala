import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  { path: 'button', loadComponent: () => import('./button/button.page').then((m) => m.ButtonPage) },
  {
    path: 'loading',
    loadComponent: () => import('./loading/loading.page').then((m) => m.LoadingPage),
  },
];
