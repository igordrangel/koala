import { Command, Flags } from '@oclif/core';
import { installResource } from '../utils/install-resource';
import { green } from 'ansis';

export default class Resource extends Command {
  static override description = 'add a resource to the project core folder';
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
      description: 'name of the resource',
      required: true,
      options: ['base', 'auth', 'error-handler'],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Resource);
    const projectName = flags.project || (process.cwd().split('/').pop() as string);

    installResource(projectName, flags.name as any);

    this.log(green('INSTALLED'), flags.name);
  }
}
