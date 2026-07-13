import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { UI_COPY } from '../i18n/ui-copy';
import type { Locale } from '../models/locale.types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../models/locale.types';

const SITE_URL = 'https://koalarx.com';
const OG_IMAGE = `${SITE_URL}/logo.svg`;
const JSON_LD_ID = 'koala-json-ld';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  update(locale: Locale) {
    const seo = UI_COPY[locale].seo;
    const pageUrl = `${SITE_URL}/${locale}/`;
    const htmlLang = locale === 'pt' ? 'pt-BR' : 'en';

    this.document.documentElement.lang = htmlLang;
    this.title.setTitle(seo.title);

    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    });

    this.setCanonical(pageUrl);
    this.setHreflang();
    this.setOpenGraph(seo.title, seo.description, pageUrl, htmlLang);
    this.setTwitter(seo.title, seo.description);
    this.setJsonLd(seo.title, seo.description, locale);
  }

  private setCanonical(url: string) {
    this.upsertLink('canonical', url);
  }

  private setHreflang() {
    this.document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((element) => element.remove());

    const alternates: { hreflang: string; href: string }[] = [
      ...SUPPORTED_LOCALES.map((locale) => ({
        hreflang: locale === 'pt' ? 'pt-BR' : 'en',
        href: `${SITE_URL}/${locale}/`,
      })),
      { hreflang: 'x-default', href: `${SITE_URL}/${DEFAULT_LOCALE}/` },
    ];

    for (const alternate of alternates) {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alternate.hreflang);
      link.setAttribute('href', alternate.href);
      this.document.head.appendChild(link);
    }
  }

  private setOpenGraph(title: string, description: string, url: string, locale: string) {
    this.meta.updateTag({ property: 'og:site_name', content: 'Koala' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:locale', content: locale === 'pt-BR' ? 'pt_BR' : 'en_US' });
    this.meta.updateTag({ property: 'og:locale:alternate', content: locale === 'pt-BR' ? 'en_US' : 'pt_BR' });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:alt', content: 'Koala — ecossistema de bibliotecas' });
  }

  private setTwitter(title: string, description: string) {
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });
  }

  private setJsonLd(title: string, description: string, locale: Locale) {
    let script = this.document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'Koala',
          description,
          inLanguage: ['pt-BR', 'en'],
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'Koala',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: OG_IMAGE,
          },
          sameAs: [
            'https://github.com/igordrangel/koala-ui',
            'https://github.com/igordrangel/koala-nest',
            'https://github.com/igordrangel/koala-utils',
            'https://www.npmjs.com/org/koalarx',
          ],
        },
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/${locale}/#webpage`,
          url: `${SITE_URL}/${locale}/`,
          name: title,
          description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
        },
      ],
    });
  }

  private upsertLink(rel: string, href: string) {
    let link = this.document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }
}
