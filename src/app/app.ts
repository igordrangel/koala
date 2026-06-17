import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from './core/components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './core/components/site-header/site-header.component';
import { LocaleService } from './core/services/locale.service';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
})
export class App {
  private readonly localeService = inject(LocaleService);
  private readonly seoService = inject(SeoService);

  constructor() {
    effect(() => {
      this.seoService.update(this.localeService.locale());
    });
  }
}
