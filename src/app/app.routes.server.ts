import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: ':locale',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ locale: 'pt' }, { locale: 'en' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
