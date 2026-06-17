import type { LibraryId } from '@/core/models/library-meta';

export type LibraryCardTheme = {
  border: string;
  borderHover: string;
  shadow: string;
  shadowHover: string;
  glowA: string;
  glowB: string;
  ring: string;
};

export const LIBRARY_CARD_THEMES: Record<LibraryId, LibraryCardTheme> = {
  ui: {
    border: 'border-red-500/35',
    borderHover: 'hover:border-red-400/55',
    shadow: 'shadow-lg shadow-red-500/15',
    shadowHover: 'hover:shadow-red-500/25',
    glowA: 'bg-red-500/25',
    glowB: 'bg-primary/20',
    ring: 'border-red-400/25',
  },
  nest: {
    border: 'border-rose-500/35',
    borderHover: 'hover:border-rose-400/55',
    shadow: 'shadow-lg shadow-rose-500/15',
    shadowHover: 'hover:shadow-rose-500/25',
    glowA: 'bg-rose-500/25',
    glowB: 'bg-rose-400/10',
    ring: 'border-rose-400/25',
  },
  utils: {
    border: 'border-sky-500/35',
    borderHover: 'hover:border-sky-400/55',
    shadow: 'shadow-lg shadow-sky-500/15',
    shadowHover: 'hover:shadow-sky-500/25',
    glowA: 'bg-sky-500/25',
    glowB: 'bg-cyan-400/10',
    ring: 'border-sky-400/25',
  },
};
