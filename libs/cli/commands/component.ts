import { Command, Flags } from '@oclif/core';
import { installComponent } from '../utils/install-component';
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
      description: 'name of the component',
      required: true,
      options: ['button', 'loading', 'dropdown', 'modal'],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Component);
    const projectName = flags.project || (process.cwd().split('/').pop() as string);

    installComponent(projectName, flags.name as any);

    this.log(green('INSTALLED'), flags.name);
  }
}
