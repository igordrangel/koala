import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES } from '../models/locale.types';
import { parseLocaleFromUrl } from '../utils/locale-url';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly router = inject(Router);

  readonly supportedLocales = SUPPORTED_LOCALES;
  readonly defaultLocale = DEFAULT_LOCALE;

  readonly locale = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => parseLocaleFromUrl(this.router.url)),
      startWith(parseLocaleFromUrl(this.router.url)),
    ),
    { initialValue: parseLocaleFromUrl(this.router.url) },
  );

  homeRoute(locale = this.locale()) {
    return `/${locale}`;
  }

  switchLocalePath(target: Locale): string {
    return `/${target}`;
  }
}
