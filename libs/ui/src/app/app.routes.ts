import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'components',
    loadChildren: () => import('./features/components/routes').then((m) => m.ROUTES),
  },
];
