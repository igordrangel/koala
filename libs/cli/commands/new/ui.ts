import { installComponent } from '@/cli/utils/install-component';
import { installResource } from '@/cli/utils/install-resource';
import { Command, Flags, Interfaces } from '@oclif/core';
import { green } from 'ansis';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

type NewUiFlags = Interfaces.InferredFlags<typeof NewUi.flags>;

export default class NewUi extends Command {
  static override description = 'create a new UI project';
  static override examples = ['<%= config.bin %> <%= command.id %>'];
  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'name to print' }),
    core: Flags.string({ description: 'core resources' }),
    components: Flags.string({ description: 'components to install' }),
  };

  private createAngularProject(name: string) {
    const flags = ['--defaults', '--style=tailwind'];

    spawnSync('bunx', ['ng', 'n', name, ...flags], { stdio: 'inherit', shell: true });
  }

  private createFolderStructure(name: string, flags: NewUiFlags) {
    rmSync(`${name}/src/app/app.css`);

    const indexHtml = readFileSync(`dist/ui/index.html`, 'utf-8');
    writeFileSync(`${name}/src/index.html`, indexHtml.replace('--projectName--', name));

    const appTs = readFileSync(`dist/ui/app.ts`, 'utf-8');
    writeFileSync(`${name}/src/app/app.ts`, appTs.replace('--projectName--', name));

    const styles = readFileSync(`dist/ui/styles.css`, 'utf-8');
    writeFileSync(`${name}/src/styles.css`, styles);

    const folders: { [key: string]: string[] } = {
      core: flags.core?.split(',').map((res) => res.trim()) ?? [],
      features: [],
      shared: ['components', 'models', 'pipes', 'services', 'utils'],
      components: flags.components?.split(',').map((comp) => comp.trim()) ?? [],
    };

    for (const [folder, subfolders] of Object.entries(folders)) {
      if (folder !== 'components') {
        mkdirSync(`${name}/src/app/${folder}`, { recursive: true });
        this.log(green('CREATED'), `${name}/src/app/${folder}`);
      }

      switch (folder) {
        case 'core':
          for (const resource of subfolders) {
            installResource(name, resource as any);
            this.log(green('INSTALLED'), `${resource} in ${name}/src/app/${folder}`);
          }
          break;
        case 'components':
          for (const component of subfolders) {
            installComponent(name, component as any);
            this.log(green('INSTALLED'), `${component} in ${name}/src/app/${folder}`);
          }
          break;
        default:
          for (const subfolder of subfolders) {
            mkdirSync(`${name}/src/app/${folder}/${subfolder}`, { recursive: true });
            this.log(green('CREATED'), `${name}/src/app/${folder}/${subfolder}`);
          }
      }
    }
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(NewUi);

    const name = flags.name;

    if (!name) {
      this.error('Please provide a name using the --name or -n flag');
    }

    this.createAngularProject(name);
    this.createFolderStructure(name, flags);

    spawnSync(`cd ${name} && bunx ng generate environments`, { stdio: 'inherit', shell: true });
    spawnSync(`cd ${name} && bunx ng generate @angular/core:cleanup-unused-imports`, {
      stdio: 'inherit',
      shell: true,
    });
  }
}
