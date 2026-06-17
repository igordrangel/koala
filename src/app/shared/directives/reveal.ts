import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[appReveal]',
})
export class Reveal implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit() {
    const element = this.elementRef.nativeElement;
    element.classList.add('motion-reveal-scroll');

    if (!isPlatformBrowser(this.platformId)) {
      element.classList.add('motion-visible');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.show(element);
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        this.show(element);
      },
      { threshold: 0, rootMargin: '0px 0px -2% 0px' },
    );

    this.observer.observe(element);

    requestAnimationFrame(() => {
      if (this.isInViewport(element)) {
        this.show(element);
      }
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private show(element: HTMLElement) {
    element.classList.add('motion-visible');
    this.observer?.unobserve(element);
  }

  private isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;

    return rect.top < viewHeight && rect.bottom > 0;
  }
}
