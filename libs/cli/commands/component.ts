import { Command, Flags } from '@oclif/core';
import { installComponent } from '../utils/install-component';
import { green } from 'ansis';

export default class Component extends Command {
  static override description = 'add a component to the project';
  static override examples = ['<%= config.bin %> <%= command.id %>'];
  static override flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({
      char: 'n',
      description: 'name of the component',
      required: true,
      options: ['button'],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Component);

    installComponent('example', flags.name as any);

    this.log(green('INSTALLED'), flags.name);
  }
}
