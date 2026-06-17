import { Routes } from '@angular/router';
import { localeGuard } from './core/guards/locale.guard';
import { LandingPageComponent } from './features/landing/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pt',
    pathMatch: 'full',
  },
  {
    path: ':locale',
    component: LandingPageComponent,
    canActivate: [localeGuard],
  },
  {
    path: '**',
    redirectTo: 'pt',
  },
];
