import { Component, computed, input } from '@angular/core';
import { Button } from '@/shared/components/button';
import { Reveal } from '@/shared/directives/reveal';
import type { LibraryId } from '@/core/models/library-meta';
import { LIBRARY_CARD_THEMES } from './library-card.themes';

export interface LibraryCardViewModel {
  id: LibraryId;
  name: string;
  packageName: string;
  tagline: string;
  description: string;
  installCommand: string;
  docsUrl: string;
  npmUrl: string;
  githubUrl: string;
  accentClass: string;
  icon?: string;
  logo?: string;
}

export interface LibraryCardLabels {
  docs: string;
  npm: string;
  github: string;
}

@Component({
  selector: 'app-library-card',
  templateUrl: './library-card.html',
  imports: [Button, Reveal],
})
export class LibraryCardComponent {
  readonly library = input.required<LibraryCardViewModel>();
  readonly labels = input.required<LibraryCardLabels>();
  readonly revealDelay = input<1 | 2 | 3>(1);

  readonly theme = computed(() => LIBRARY_CARD_THEMES[this.library().id]);

  readonly cardClass = computed(() => {
    const theme = this.theme();
    return [
      'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-base-100/80 p-6 backdrop-blur-sm koala-effect-card motion-reduce:hover:translate-y-0',
      theme.border,
      theme.borderHover,
      theme.shadow,
      theme.shadowHover,
    ].join(' ');
  });

  readonly revealClass = computed(() => {
    const delay = this.revealDelay();
    return delay > 1 ? `motion-delay-${delay}` : '';
  });
}
