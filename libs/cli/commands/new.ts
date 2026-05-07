import chalk from 'chalk';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  askPackageManager,
  getAngularCreateCommand,
  getPmCommands,
  getProjectExecCommand,
  PackageManager,
  PmCommands,
} from '../utils/package-manager';
import { logHeader, logStep, logSuccess } from '../utils/cli-ui';
import { runCommand } from '../utils/run-command';
import { setupGlobalTests } from '../utils/setup-global-tests';

const originPath = path.join(__dirname, '../../');

export interface NewArgs {
  name: string;
  pm?: PackageManager;
  verbose?: boolean;
}

function createAngularProject(
  name: string,
  pmName: PackageManager,
  pm: PmCommands,
  verbose = false,
) {
  runCommand(getAngularCreateCommand(name, pmName), { verbose });
  runCommand(`${pm.install} @koalarx/utils clsx`, {
    cwd: name,
    verbose,
  });
  runCommand(
    `${pm.installDev} angular-eslint @vitest/eslint-plugin eslint-plugin-prettier typescript-eslint daisyui`,
    {
      cwd: name,
      verbose,
    },
  );

  const angularJson = JSON.parse(readFileSync(`${name}/angular.json`, 'utf-8'));
  angularJson.projects[name].architect.build.options.styles.push(
    'src/theme/icons/font-awesome/css/all.min.css',
  );
  writeFileSync(`${name}/angular.json`, JSON.stringify(angularJson, null, 2));
  cpSync(`${originPath}/ui/theme/icons`, `${name}/src/theme/icons`, { recursive: true });
  cpSync(`${originPath}/ui/theme/animations.css`, `${name}/src/theme/animations.css`);

  const vscodeSettingsPath = `${originPath}/ui/.vscode/settings.json`;
  if (existsSync(vscodeSettingsPath)) {
    cpSync(vscodeSettingsPath, `${name}/.vscode/settings.json`);
  }
}

function createFolderStructure(name: string) {
  rmSync(`${name}/src/app/app.css`);

  const indexHtml = readFileSync(`${originPath}/ui/index.html`, 'utf-8');
  writeFileSync(`${name}/src/index.html`, indexHtml.replace('@koalarx/ui', name));

  const appTs = readFileSync(`${name}/src/app/app.ts`, 'utf-8');
  writeFileSync(
    `${name}/src/app/app.ts`,
    appTs.replace("styleUrl: './app.css',", '').replace("styleUrl: './app.css'", ''),
  );

  const styles = readFileSync(`${originPath}/ui/styles.css`, 'utf-8');
  writeFileSync(`${name}/src/styles.css`, styles);

  const tsConfig = JSON.parse(
    readFileSync(`${name}/tsconfig.json`, 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''),
  );
  tsConfig.compilerOptions.paths = { '@/*': ['./src/app/*'] };
  writeFileSync(`${name}/tsconfig.json`, JSON.stringify(tsConfig, null, 2));

  const tsConfigApp = JSON.parse(
    readFileSync(`${name}/tsconfig.app.json`, 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''),
  );
  tsConfigApp.compilerOptions.rootDir = './src';
  tsConfigApp.include = ['src/**/*.ts'];
  tsConfigApp.exclude = ['src/**/*.spec.ts'];
  writeFileSync(`${name}/tsconfig.app.json`, JSON.stringify(tsConfigApp, null, 2));

  const tsConfigSpec = JSON.parse(
    readFileSync(`${name}/tsconfig.spec.json`, 'utf-8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''),
  );
  tsConfigSpec.compilerOptions.rootDir = './src';
  tsConfigSpec.include = ['src/**/*.d.ts', 'src/**/*.spec.ts'];
  writeFileSync(`${name}/tsconfig.spec.json`, JSON.stringify(tsConfigSpec, null, 2));

  cpSync(`${originPath}/ui/eslint.config.mts`, `${name}/eslint.config.mts`);

  mkdirSync(`${name}/src/app/shared`, { recursive: true });
  console.log(chalk.green('CREATED'), `${name}/src/app/shared`);
}

export async function runNewCommand(args: NewArgs): Promise<void> {
  const name = args.name;
  const verbose = args.verbose ?? false;

  if (!name) {
    throw new Error('Please provide a project name (e.g. "kl new example") or use --name/-n');
  }

  const pmName = args.pm ?? (await askPackageManager());
  const pm = getPmCommands(pmName);

  logHeader(console.log, 'KOALA UI PROJECT SETUP', `Project: ${name}`);
  logStep(console.log, 'Creating Angular project structure');
  createAngularProject(name, pmName, pm, verbose);
  logSuccess(console.log, 'Angular project created');

  logStep(console.log, 'Applying Koala folder structure and styles');
  createFolderStructure(name);
  logSuccess(console.log, 'Koala structure ready');

  logStep(console.log, 'Configuring test stack (unit + e2e + CI workflow)');
  setupGlobalTests(name, verbose);
  logSuccess(console.log, 'Test stack configured');

  logStep(console.log, 'Generating environments and lint baseline');
  runCommand(getProjectExecCommand(pmName, 'ng generate environments'), {
    cwd: name,
    verbose,
  });
  runCommand(getProjectExecCommand(pmName, 'eslint . --fix'), {
    cwd: name,
    verbose,
  });
  logSuccess(console.log, 'Project ready');
}
