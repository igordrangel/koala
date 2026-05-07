import { spawnSync } from 'node:child_process';
import { cpSync, rmSync, readFileSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
spawnSync('tsc', ['-p', 'libs/cli/tsconfig.json'], { stdio: 'inherit' });
cpSync('libs/ui/.vscode/settings.json', 'dist/ui/.vscode/settings.json');
cpSync('libs/ui/src/app/shared/components', 'dist/ui/components', { recursive: true });
cpSync('libs/ui/src/app/shared/validators', 'dist/ui/validators', { recursive: true });
cpSync('libs/ui/src/app/shared/directives', 'dist/ui/directives', { recursive: true });
cpSync('libs/ui/src/app/shared/utils', 'dist/ui/utils', { recursive: true });
cpSync('libs/ui/src/app/shared/base', 'dist/ui/base', { recursive: true });
cpSync('libs/ui/src/theme', 'dist/ui/theme', { recursive: true });
cpSync('libs/ui/src/theme/animations.css', 'dist/ui/theme/animations.css');
cpSync('libs/ui/src/app/app.ts', 'dist/ui/app.ts');
cpSync('libs/ui/src/index.html', 'dist/ui/index.html');

cpSync('libs/ui/src/styles.css', 'dist/ui/styles.css');
const styles = readFileSync('dist/ui/styles.css', 'utf-8');
writeFileSync(
  'dist/ui/styles.css',
  styles.replace(/\/\* --start-internal-- \*\/[\s\S]*?\/\* --end-internal-- \*\//g, ''),
);

cpSync('libs/ui/eslint.config.mts', 'dist/ui/eslint.config.mts');
cpSync('README.md', 'dist/README.md');
cpSync('package.json', 'dist/package.json');

cpSync('bin', 'dist/bin', { recursive: true });

const packageJson = JSON.parse(readFileSync('dist/package.json', 'utf-8'));
packageJson.oclif.commands = './cli/commands';

delete packageJson.devDependencies;
delete packageJson.scripts;
delete packageJson.prettier;

writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));
