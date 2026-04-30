import { spawnSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
spawnSync('tsc', ['-p', 'libs/cli/tsconfig.json'], { stdio: 'inherit' });
cpSync('libs/ui/src/app/shared/components', 'dist/ui/components', { recursive: true });
cpSync('libs/ui/src/app/app.ts', 'dist/ui/app.ts');
cpSync('libs/ui/src/index.html', 'dist/ui/index.html');
cpSync('libs/ui/src/styles.css', 'dist/ui/styles.css');
cpSync('libs/ui/eslint.config.mts', 'dist/ui/eslint.config.mts');
