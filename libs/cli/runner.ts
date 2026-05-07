import { runInstallCommand } from './commands/install';
import { runNewCommand } from './commands/new';
import { PackageManager } from './utils/package-manager';

function getFlagValue(args: string[], longName: string, shortName: string): string | undefined {
  const longIndex = args.indexOf(`--${longName}`);
  if (longIndex >= 0 && args[longIndex + 1]) {
    return args[longIndex + 1];
  }

  const shortIndex = args.indexOf(`-${shortName}`);
  if (shortIndex >= 0 && args[shortIndex + 1]) {
    return args[shortIndex + 1];
  }

  return undefined;
}

function hasFlag(args: string[], longName: string, shortName?: string): boolean {
  return args.includes(`--${longName}`) || (shortName ? args.includes(`-${shortName}`) : false);
}

function getFirstPositionalArg(args: string[]): string | undefined {
  for (let i = 0; i < args.length; i++) {
    const current = args[i];
    if (!current.startsWith('-')) {
      return current;
    }

    // Skip flag value when format is "--flag value" or "-f value"
    if ((current.startsWith('--') || current.startsWith('-')) && args[i + 1] && !args[i + 1].startsWith('-')) {
      i += 1;
    }
  }

  return undefined;
}

function printBanner() {
  console.log(' _  __             _       _   _ ___ ');
  console.log('| |/ /___   __ _  | | __ _| | | |_ _|');
  console.log("| ' // _ \\ / _` | | |/ _` | | | || | ");
  console.log('| . \\ (_) | (_| | | | (_| | |_| || | ');
  console.log('|_|\\_\\___/ \\__,_| |_|\\__,_|\\___/|___|');
  console.log('');
}

function printHelp() {
  printBanner();
  console.log('Usage:');
  console.log('  kl new <project> [--pm bun|npm|yarn|pnpm] [--verbose]');
  console.log('  kl install <component[,component]> [--project <name>] [--verbose]');
  console.log('');
  console.log('Commands:');
  console.log('  new      Create a new UI project');
  console.log('  install  Add one or more components to the project');
}

function printInstallHelp() {
  console.log('add a component to the project');
  console.log('');
  console.log('USAGE');
  console.log('  $ kl install <value> [-p <value>] [--verbose]');
  console.log('  $ kl install -n <value> [-p <value>] [--verbose]');
  console.log('');
  console.log('FLAGS');
  console.log(
    '  -n, --name=<value>     list of components to install. Separate multiple components with a comma',
  );
  console.log('  -p, --project=<value>  name of the project');
  console.log('  -v, --verbose          show detailed install logs');
}

export async function runCli(argv: string[]): Promise<number> {
  const [command, ...args] = argv;

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return 0;
  }

  try {
    if (command === 'new') {
      if (hasFlag(args, 'help', 'h')) {
        console.log('Usage: kl new <project> [--pm bun|npm|yarn|pnpm] [--verbose]');
        console.log('       kl new --name <project> [--pm bun|npm|yarn|pnpm] [--verbose]');
        return 0;
      }

      const name = getFirstPositionalArg(args) ?? getFlagValue(args, 'name', 'n');
      const pm = getFlagValue(args, 'pm', 'm') as PackageManager | undefined;
      const verbose = hasFlag(args, 'verbose', 'v');
      await runNewCommand({ name: name ?? '', pm, verbose });
      return 0;
    }

    if (command === 'install') {
      if (hasFlag(args, 'help', 'h')) {
        printInstallHelp();
        return 0;
      }

      const name = getFirstPositionalArg(args) ?? getFlagValue(args, 'name', 'n');
      const project = getFlagValue(args, 'project', 'p');
      const verbose = hasFlag(args, 'verbose', 'v');
      await runInstallCommand({ name: name ?? '', project, verbose });
      return 0;
    }

    console.error(`Error: command ${command} not found`);
    printHelp();
    return 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    return 1;
  }
}
