export type LibraryId = 'ui' | 'nest' | 'utils';

export interface LibraryMeta {
  id: LibraryId;
  packageName: string;
  docsUrl: string;
  npmUrl: string;
  githubUrl: string;
  accentClass: string;
  icon?: string;
  logo?: string;
}

export const LIBRARY_META: Record<LibraryId, LibraryMeta> = {
  ui: {
    id: 'ui',
    packageName: '@koalarx/ui',
    docsUrl: 'https://ui.koalarx.com',
    npmUrl: 'https://www.npmjs.com/package/@koalarx/ui',
    githubUrl: 'https://github.com/igordrangel/koala-ui',
    accentClass: 'ui-brand-text',
    logo: '/assets/logos/angular.svg',
  },
  nest: {
    id: 'nest',
    packageName: '@koalarx/nest',
    docsUrl: 'https://nest.koalarx.com',
    npmUrl: 'https://www.npmjs.com/package/@koalarx/nest',
    githubUrl: 'https://github.com/igordrangel/koala-nest',
    accentClass: 'nest-brand-text',
    logo: '/assets/logos/nestjs.svg',
  },
  utils: {
    id: 'utils',
    packageName: '@koalarx/utils',
    docsUrl: 'https://utils.koalarx.com/',
    npmUrl: 'https://www.npmjs.com/package/@koalarx/utils',
    githubUrl: 'https://github.com/igordrangel/koala-utils',
    accentClass: 'utils-brand-text',
    icon: 'fa-solid fa-toolbox',
  },
};
