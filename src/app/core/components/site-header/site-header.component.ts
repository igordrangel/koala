import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '@/shared/components/button';
import { UI_COPY } from '../../i18n/ui-copy';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  imports: [Button, RouterLink, RouterLinkActive],
})
export class SiteHeaderComponent {
  private readonly localeService = inject(LocaleService);
  private readonly router = inject(Router);

  readonly locale = this.localeService.locale;
  readonly copy = computed(() => UI_COPY[this.localeService.locale()]);
  readonly homeLink = computed(() => this.localeService.homeRoute());

  readonly navLinks = computed(() => {
    const header = this.copy().header;
    return [
      { label: header.koalaUi, href: 'https://ui.koalarx.com' },
      { label: header.koalaNest, href: 'https://nest.koalarx.com' },
      { label: header.koalaUtils, href: 'https://utils.koalarx.com/' },
    ];
  });

  switchLocale(target: 'pt' | 'en') {
    if (target === this.localeService.locale()) return;
    void this.router.navigateByUrl(this.localeService.switchLocalePath(target));
  }
}
