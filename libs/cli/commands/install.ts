import { Command, Flags } from '@oclif/core';
import { logHeader, logList, logStep, logSuccess, logWarning } from '../utils/cli-ui';
import { install } from '../utils/install';
import { InstallComponentFlags, InstallComponentFlagsList } from '../utils/install-component';

export default class Install extends Command {
  static override description = 'add a component to the project';
  static override examples = ['<%= config.bin %> <%= command.id %>'];
  static override flags = {
    project: Flags.string({
      char: 'p',
      description: 'name of the project',
      required: false,
    }),
    name: Flags.string({
      char: 'n',
      description:
        'list of components to install. Separate multiple components with a comma (e.g., "button,loading,dropdown")',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Install);
    const projectName = flags.project || (process.cwd().split('/').pop() as string);

    const flagOptions = flags.name.split(',').map((name) => name.trim()) as InstallComponentFlags[];
    const validFlagOptions = InstallComponentFlagsList;

    if (flagOptions.some((option) => !validFlagOptions.includes(option))) {
      this.error(`Invalid component name(s). Valid options are: ${validFlagOptions.join(', ')}`);
    }

    logHeader(
      this.log.bind(this),
      'KOALA COMPONENT INSTALLER',
      `Project: ${projectName} | Components: ${flagOptions.join(', ')}`,
    );

    for (const componentName of flagOptions) {
      logStep(this.log.bind(this), `Installing ${componentName}`);

      const result = install(projectName, componentName);

      if (result.missingLibs.length > 0) {
        logWarning(
          this.log.bind(this),
          `Missing external libs (${componentName}): ${result.missingLibs.join(', ')}`,
        );
      }

      logList(this.log.bind(this), 'libs', result.libs);
      logList(this.log.bind(this), 'directives', result.directives);
      logList(this.log.bind(this), 'validators', result.validators);
      logList(this.log.bind(this), 'utils', result.utils);
      logList(this.log.bind(this), 'base', result.base);
      logList(this.log.bind(this), 'dependent components', result.components);

      logSuccess(this.log.bind(this), `${componentName} installed`);
    }
  }
}
