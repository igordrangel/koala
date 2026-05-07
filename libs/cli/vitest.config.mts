import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['utils/**/*.unit.spec.ts', 'commands/**/*.unit.spec.ts'],
    environment: 'node',
    globals: true,
    reporters: ['default'],
  },
});
