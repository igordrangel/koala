import { Component, computed, inject } from '@angular/core';
import { Reveal } from '@/shared/directives/reveal';
import { UI_COPY } from '../../core/i18n/ui-copy';
import { LIBRARY_META } from '../../core/models/library-meta';
import { LocaleService } from '../../core/services/locale.service';
import { LibraryCardComponent } from './library-card/library-card';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  imports: [LibraryCardComponent, Reveal],
})
export class LandingPageComponent {
  private readonly localeService = inject(LocaleService);

  readonly copy = computed(() => UI_COPY[this.localeService.locale()]);

  readonly libraries = computed(() =>
    this.copy().libraries.map((library) => ({
      ...library,
      ...LIBRARY_META[library.id],
    })),
  );

  readonly libraryLabels = computed(() => {
    const landing = this.copy().landing;
    return { docs: landing.docs, npm: landing.npm, github: landing.github };
  });

  revealDelay(index: number): 1 | 2 | 3 {
    return (Math.min(index + 1, 3) as 1 | 2 | 3);
  }
}
