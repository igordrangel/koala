import { Component, computed, inject } from '@angular/core';
import { UI_COPY } from '../../i18n/ui-copy';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
})
export class SiteFooterComponent {
  private readonly localeService = inject(LocaleService);

  readonly copy = computed(() => UI_COPY[this.localeService.locale()]);
}
