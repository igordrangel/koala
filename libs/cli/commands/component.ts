import { Command, Flags } from '@oclif/core';
import { installComponent, InstallComponentFlags } from '../utils/install-component';
import { green } from 'ansis';

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
    const validFlagOptions: InstallComponentFlags[] = [
      'button',
      'loading',
      'dropdown',
      'modal',
      'tabs',
      'tooltip',
      'stepper',
      'collapse',
      'confirm',
      'alert',
    ];

    if (flagOptions.some((option) => !validFlagOptions.includes(option))) {
      this.error(`Invalid component name(s). Valid options are: ${validFlagOptions.join(', ')}`);
    }

    for (const componentName of flagOptions) {
      const deps = installComponent(projectName, componentName);
      if (deps.length > 0) {
        this.log('Dependencies installed:');
        for (const dep of deps) {
          this.log('- ', green(dep));
        }
        this.log('');
      }

      this.log(green('INSTALLED'), componentName);
    }
  }
}
