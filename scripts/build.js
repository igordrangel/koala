import { spawnSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
spawnSync('tsc', ['-p', 'libs/cli/tsconfig.json'], { stdio: 'inherit' });
cpSync('libs/ui', 'dist/ui', { recursive: true });
