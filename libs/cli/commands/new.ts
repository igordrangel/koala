import { Command, Flags } from '@oclif/core';
import { green } from 'ansis';
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

export default class New extends Command {
  static override description = 'create a new UI project';
  static override examples = ['<%= config.bin %> <%= command.id %>'];
  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag to pre-select package manager (skips interactive prompt)
    pm: Flags.string({
      char: 'm',
      description: 'package manager to use (bun, npm, yarn, pnpm)',
      options: ['bun', 'npm', 'yarn', 'pnpm'],
    }),
  };

  private createAngularProject(name: string, pmName: PackageManager, pm: PmCommands) {
    runCommand(getAngularCreateCommand(name, pmName));
    runCommand(`cd ${name} && ${pm.install} @koalarx/utils clsx`);
    runCommand(
      `cd ${name} && ${pm.installDev} angular-eslint @vitest/eslint-plugin eslint-plugin-prettier typescript-eslint daisyui`,
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

  private createFolderStructure(name: string) {
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
    this.log(green('CREATED'), `${name}/src/app/shared`);
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(New);

    const name = flags.name;

    if (!name) {
      this.error('Please provide a name using the --name or -n flag');
    }

    const pmName = (flags.pm as PackageManager | undefined) ?? askPackageManager();
    const pm = getPmCommands(pmName);

    logHeader(this.log.bind(this), 'KOALA UI PROJECT SETUP', `Project: ${name}`);
    logStep(this.log.bind(this), 'Creating Angular project structure');
    this.createAngularProject(name, pmName, pm);
    logSuccess(this.log.bind(this), 'Angular project created');

    logStep(this.log.bind(this), 'Applying Koala folder structure and styles');
    this.createFolderStructure(name);
    logSuccess(this.log.bind(this), 'Koala structure ready');

    logStep(this.log.bind(this), 'Configuring test stack (unit + e2e + CI workflow)');
    setupGlobalTests(name);
    logSuccess(this.log.bind(this), 'Test stack configured');

    logStep(this.log.bind(this), 'Generating environments and lint baseline');
    runCommand(`cd ${name} && ${getProjectExecCommand(pmName, 'ng generate environments')}`);
    runCommand(`cd ${name} && ${getProjectExecCommand(pmName, 'eslint . --fix')}`);
    logSuccess(this.log.bind(this), 'Project ready');
  }
}
