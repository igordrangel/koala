import { Command, Flags } from '@oclif/core';
import { green } from 'ansis';
import {
  installComponent,
  InstallComponentFlags,
  InstallComponentFlagsList,
} from '../utils/install-component';

export default class Component extends Command {
  static override description = 'add a component to the project';
  static override examples = ['<%= config.bin %> <%= command.id %>'];
  static override flags = {
    project: Flags.string({
      char: 'p',
      description: 'name of the project',
      required: false,
    }),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({
      char: 'n',
      description:
        'name of the component. Separate multiple components with a comma (e.g., "button,loading,dropdown")',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Component);
    const projectName = flags.project || (process.cwd().split('/').pop() as string);

    const flagOptions = flags.name.split(',').map((name) => name.trim()) as InstallComponentFlags[];
    const validFlagOptions = InstallComponentFlagsList;

    if (flagOptions.some((option) => !validFlagOptions.includes(option))) {
      this.error(`Invalid component name(s). Valid options are: ${validFlagOptions.join(', ')}`);
    }

    for (const componentName of flagOptions) {
      this.log('');
      this.log('----------------------------------');
      this.log('Installing component:', green(componentName));
      this.log('----------------------------------');
      this.log('');

      const result = installComponent(projectName, componentName);

      if (result.libs.length > 0) {
        this.log('External libraries installed:');
        for (const dep of result.libs) {
          this.log('- ', green(dep));
        }
        this.log('');
      }

      if (result.pipes.length > 0) {
        this.log('Pipes installed:');
        for (const dep of result.pipes) {
          this.log('- ', green(dep));
        }
        this.log('');
      }

      if (result.directives.length > 0) {
        this.log('Directives installed:');
        for (const dep of result.directives) {
          this.log('- ', green(dep));
        }
        this.log('');
      }

      if (result.validators.length > 0) {
        this.log('Validators installed:');
        for (const dep of result.validators) {
          this.log('- ', green(dep));
        }
        this.log('');
      }

      if (result.utils.length > 0) {
        this.log('Utils installed:');
        for (const dep of result.utils) {
          this.log('- ', green(dep));
        }
        this.log('');
      }

      if (result.components.length > 0) {
        this.log('Components installed:');
        for (const dep of result.components) {
          this.log('- ', green(dep));
        }
        this.log('');
      }

      this.log(green('INSTALLED'), componentName);
    }
  }
}
