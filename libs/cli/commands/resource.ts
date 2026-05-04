import { Command, Flags } from '@oclif/core';
import { installResource, InstallResourceFlags } from '../utils/install-resource';
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
      description:
        'name of the resource. Separate multiple resources with a comma (e.g., "base,auth,error-handler")',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Resource);
    const projectName = flags.project || (process.cwd().split('/').pop() as string);

    const flagOptions = flags.name.split(',').map((name) => name.trim()) as InstallResourceFlags[];
    const validFlagOptions: InstallResourceFlags[] = ['base', 'auth', 'error-handler'];

    if (flagOptions.some((option) => !validFlagOptions.includes(option))) {
      this.error(`Invalid resource name(s). Valid options are: ${validFlagOptions.join(', ')}`);
    }

    for (const resourceName of flagOptions) {
      installResource(projectName, resourceName);
      this.log(green('INSTALLED'), resourceName);
    }
  }
}
