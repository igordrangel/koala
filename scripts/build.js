import { spawnSync } from 'node:child_process';
import { cpSync, rmSync, readFileSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
spawnSync('tsc', ['-p', 'libs/cli/tsconfig.json'], { stdio: 'inherit' });
cpSync('libs/ui/public/assets/icons', 'dist/ui/assets/icons', { recursive: true });
cpSync('libs/ui/src/app/shared/components', 'dist/ui/components', { recursive: true });
cpSync('libs/ui/src/theme', 'dist/ui/theme', { recursive: true });
cpSync('libs/ui/src/app/app.ts', 'dist/ui/app.ts');
cpSync('libs/ui/src/index.html', 'dist/ui/index.html');

cpSync('libs/ui/src/styles.css', 'dist/ui/styles.css');
const styles = readFileSync('dist/ui/styles.css', 'utf-8');
writeFileSync(
  'dist/ui/styles.css',
  styles.replace(/\/\* --start-internal-- \*\/[\s\S]*?\/\* --end-internal-- \*\//g, ''),
);

cpSync('libs/ui/eslint.config.mts', 'dist/ui/eslint.config.mts');
