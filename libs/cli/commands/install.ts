import { logHeader, logList, logStep, logSuccess, logWarning } from '../utils/cli-ui';
import { install } from '../utils/install';
import { InstallComponentFlags, InstallComponentFlagsList } from '../utils/install-component';

export interface InstallArgs {
  name: string;
  project?: string;
  verbose?: boolean;
}

export async function runInstallCommand(args: InstallArgs): Promise<void> {
  const logger = console.log;
  const projectName = args.project || (process.cwd().split('/').pop() as string);
  const verbose = args.verbose ?? false;

  if (!args.name) {
    throw new Error('Please provide components (e.g. "kl install datatable") or use --name/-n');
  }

  const flagOptions = args.name.split(',').map((name) => name.trim()) as InstallComponentFlags[];
  const validFlagOptions = InstallComponentFlagsList;

  if (flagOptions.some((option) => !validFlagOptions.includes(option))) {
    throw new Error(`Invalid component name(s). Valid options are: ${validFlagOptions.join(', ')}`);
  }

  logHeader(
    logger,
    'KOALA COMPONENT INSTALLER',
    `Project: ${projectName} | Components: ${flagOptions.join(', ')}`,
  );

  for (const componentName of flagOptions) {
    logStep(logger, `Installing ${componentName}`);

    const result = await install(projectName, componentName, verbose);

    if (result.missingLibs.length > 0) {
      logWarning(
        logger,
        `Missing external libs (${componentName}): ${result.missingLibs.join(', ')}`,
      );
    }

    logList(logger, 'libs', result.libs);
    logList(logger, 'directives', result.directives);
    logList(logger, 'validators', result.validators);
    logList(logger, 'utils', result.utils);
    logList(logger, 'base', result.base);
    logList(logger, 'dependent components', result.components);

    logSuccess(logger, `${componentName} installed`);
  }
}
