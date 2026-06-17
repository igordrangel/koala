import type { LibraryId } from '../models/library-meta';
import type { Locale } from '../models/locale.types';

export interface LibraryCopy {
  id: LibraryId;
  name: string;
  tagline: string;
  description: string;
  installCommand: string;
}

export interface WhyCardCopy {
  title: string;
  description: string;
}

export interface SiteCopy {
  language: string;
  seo: {
    title: string;
    description: string;
  };
  header: {
    koalaUi: string;
    koalaNest: string;
    koalaUtils: string;
  };
  landing: {
    heroBadge: string;
    heroLead: string;
    heroBrand: string;
    heroTrail: string;
    heroSubtitle: string;
    librariesTitle: string;
    librariesSubtitle: string;
    docs: string;
    npm: string;
    github: string;
    whyTitle: string;
    whySubtitle: string;
  };
  libraries: LibraryCopy[];
  whyCards: WhyCardCopy[];
  footer: {
    description: string;
    libraries: string;
    creator: string;
    creatorRole: string;
    copyright: string;
    tagline: string;
  };
}

export const UI_COPY: Record<Locale, SiteCopy> = {
  pt: {
    language: 'Idioma',
    seo: {
      title: 'Koala — Ecossistema de bibliotecas',
      description:
        'Índice oficial das bibliotecas Koala: Koala UI, Koala Nest e Koala Utils. Ferramentas para front-end Angular e APIs NestJS.',
    },
    header: {
      koalaUi: 'Koala UI',
      koalaNest: 'Koala Nest',
      koalaUtils: 'Koala Utils',
    },
    landing: {
      heroBadge: 'koala-ui · koala-nest · koala-utils',
      heroLead: 'O ecossistema ',
      heroBrand: 'Koala',
      heroTrail: ' para suas aplicações Angular e NestJS.',
      heroSubtitle:
        'Componentes de UI, scaffolding de APIs e utilitários TypeScript — tudo pensado para produtividade, consistência e uma experiência moderna de desenvolvimento.',
      librariesTitle: 'Bibliotecas',
      librariesSubtitle: 'Três projetos complementares que compõem o ecossistema Koala.',
      docs: 'Documentação',
      npm: 'npm',
      github: 'GitHub',
      whyTitle: 'Por que Koala?',
      whySubtitle: 'Padrões compartilhados entre front-end e back-end.',
    },
    libraries: [
      {
        id: 'ui',
        name: 'Koala UI',
        tagline: 'Componentes Angular prontos para produção',
        description:
          'A experiência shadcn/ui, nativa para Angular. Signals, Tailwind CSS v4, SSR e zoneless. CLI para copiar componentes direto no seu projeto.',
        installCommand: 'npm install -g @koalarx/ui',
      },
      {
        id: 'nest',
        name: 'Koala Nest',
        tagline: 'APIs NestJS com DDD e TypeORM',
        description:
          'CLI que copia módulos prontos para o seu repositório: arquitetura DDD, CRUD, autenticação, cache, jobs e OpenAPI com Scalar.',
        installCommand: 'npm install -g @koalarx/nest',
      },
      {
        id: 'utils',
        name: 'Koala Utils',
        tagline: 'Validadores, datas e conversores TypeScript',
        description:
          'Biblioteca utilitária compartilhada pelo ecossistema: KlString, KlDate, KlNumber, KlArray, KlCron e validações brasileiras (CPF/CNPJ).',
        installCommand: 'npm install @koalarx/utils',
      },
    ],
    whyCards: [
      {
        title: 'Copy & paste, não npm package',
        description:
          'Koala UI e Koala Nest copiam código para o seu repositório — você mantém controle total, sem dependências opacas de componentes ou módulos.',
      },
      {
        title: 'Stack moderna',
        description:
          'Angular 21 com Signals e SSG, NestJS com DDD, Tailwind CSS v4 e DaisyUI — tudo alinhado ao que a comunidade já usa em produção.',
      },
      {
        title: 'Pronto para IA',
        description:
          'Documentação em markdown, llms.txt e componentes copiados no projeto facilitam o uso com Cursor, Copilot e outros agentes de código.',
      },
      {
        title: 'Utils compartilhados',
        description:
          '@koalarx/utils centraliza validações brasileiras, formatação de datas, strings e arrays — a mesma base nos projetos UI e Nest.',
      },
    ],
    footer: {
      description:
        'Ecossistema de bibliotecas open source para Angular, NestJS e utilitários TypeScript.',
      libraries: 'Bibliotecas',
      creator: 'Creator',
      creatorRole: 'Design, front-end e estratégia de produto.',
      copyright: '© 2026 Koala — igordrangel',
      tagline: 'Feito para desenvolvedores Angular e NestJS.',
    },
  },
  en: {
    language: 'Language',
    seo: {
      title: 'Koala — Library ecosystem',
      description:
        'Official index of Koala libraries: Koala UI, Koala Nest, and Koala Utils. Tools for Angular front-end and NestJS APIs.',
    },
    header: {
      koalaUi: 'Koala UI',
      koalaNest: 'Koala Nest',
      koalaUtils: 'Koala Utils',
    },
    landing: {
      heroBadge: 'koala-ui · koala-nest · koala-utils',
      heroLead: 'The ',
      heroBrand: 'Koala',
      heroTrail: ' ecosystem for your Angular and NestJS applications.',
      heroSubtitle:
        'UI components, API scaffolding, and TypeScript utilities — all built for productivity, consistency, and a modern developer experience.',
      librariesTitle: 'Libraries',
      librariesSubtitle: 'Three complementary projects that make up the Koala ecosystem.',
      docs: 'Documentation',
      npm: 'npm',
      github: 'GitHub',
      whyTitle: 'Why Koala?',
      whySubtitle: 'Shared patterns across front-end and back-end.',
    },
    libraries: [
      {
        id: 'ui',
        name: 'Koala UI',
        tagline: 'Production-ready Angular components',
        description:
          'The shadcn/ui experience, native to Angular. Signals, Tailwind CSS v4, SSR, and zoneless. CLI to copy components directly into your project.',
        installCommand: 'npm install -g @koalarx/ui',
      },
      {
        id: 'nest',
        name: 'Koala Nest',
        tagline: 'NestJS APIs with DDD and TypeORM',
        description:
          'CLI that copies ready-made modules into your repository: DDD architecture, CRUD, auth, cache, jobs, and OpenAPI with Scalar.',
        installCommand: 'npm install -g @koalarx/nest',
      },
      {
        id: 'utils',
        name: 'Koala Utils',
        tagline: 'Validators, dates, and TypeScript converters',
        description:
          'Shared utility library across the ecosystem: KlString, KlDate, KlNumber, KlArray, KlCron, and Brazilian validations (CPF/CNPJ).',
        installCommand: 'npm install @koalarx/utils',
      },
    ],
    whyCards: [
      {
        title: 'Copy & paste, not npm packages',
        description:
          'Koala UI and Koala Nest copy code into your repository — you stay in full control, without opaque component or module dependencies.',
      },
      {
        title: 'Modern stack',
        description:
          'Angular 21 with Signals and SSG, NestJS with DDD, Tailwind CSS v4, and DaisyUI — aligned with what teams already run in production.',
      },
      {
        title: 'AI-ready',
        description:
          'Markdown docs, llms.txt, and copied-in-project components make it easy to use with Cursor, Copilot, and other coding agents.',
      },
      {
        title: 'Shared utils',
        description:
          '@koalarx/utils centralizes Brazilian validations, date formatting, strings, and arrays — the same foundation for UI and Nest projects.',
      },
    ],
    footer: {
      description: 'Open source library ecosystem for Angular, NestJS, and TypeScript utilities.',
      libraries: 'Libraries',
      creator: 'Creator',
      creatorRole: 'Design, front-end, and product strategy.',
      copyright: '© 2026 Koala — igordrangel',
      tagline: 'Built for Angular and NestJS developers.',
    },
  },
};
