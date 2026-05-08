import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Tooltip } from '../../../shared/components/tooltip/tooltip';

@Component({
  selector: 'app-section-container',
  templateUrl: './section-container.html',
  imports: [Tooltip],
})
export class SectionContainer {
  private readonly router = inject(Router);

  readonly copied = signal(false);

  /** Derives the docs/<slug>.md URL from the current route segment. */
  readonly aiDocUrl = computed(() => {
    const url = this.router.url;
    // e.g. "/components/button" → "button"
    // e.g. "/get-started/introduction" → "get-started"
    const segments = url.split('/').filter(Boolean);
    const slug = segments.length >= 2 ? segments[1] : (segments[0] ?? '');
    return `${window.location.origin}/docs/${slug}.md`;
  });

  copyAiDocUrl() {
    navigator.clipboard.writeText(this.aiDocUrl()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
