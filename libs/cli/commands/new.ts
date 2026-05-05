import { Command, Flags } from '@oclif/core';
import { green } from 'ansis';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const originPath = path.join(__dirname, '../../');

export default class New extends Command {
  static override description = 'create a new UI project';
  static override examples = ['<%= config.bin %> <%= command.id %>'];
  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
  };

  private createAngularProject(name: string) {
    const flags = ['--defaults', '--style=tailwind'];

    spawnSync('bunx', ['ng', 'n', name, ...flags], { stdio: 'inherit', shell: true });
    spawnSync(`cd ${name} && bun i @koalarx/utils clsx`, { stdio: 'inherit', shell: true });
    spawnSync(
      `cd ${name} && bun i -D angular-eslint @vitest/eslint-plugin eslint-plugin-prettier typescript-eslint daisyui`,
      {
        stdio: 'inherit',
        shell: true,
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

    const folders: { [key: string]: string[] } = {
      features: [],
      shared: ['components', 'models', 'pipes', 'services', 'utils', 'validators'],
    };

    for (const [folder, subfolders] of Object.entries(folders)) {
      switch (folder) {
        default:
          for (const subfolder of subfolders) {
            mkdirSync(`${name}/src/app/${folder}/${subfolder}`, { recursive: true });
            this.log(green('CREATED'), `${name}/src/app/${folder}/${subfolder}`);
          }
      }
    }
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(New);

    const name = flags.name;

    if (!name) {
      this.error('Please provide a name using the --name or -n flag');
    }

    this.createAngularProject(name);
    this.createFolderStructure(name);

    spawnSync(`cd ${name} && bunx ng generate environments`, { stdio: 'inherit', shell: true });
    spawnSync(`cd ${name} && bunx eslint . --fix`, { stdio: 'inherit', shell: true });
  }
}
