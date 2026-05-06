import readline from 'readline-sync';
import { detectPackageManager, getPmCommands } from './package-manager';
import { getProjectPath } from './project-path';
import { runCommand } from './run-command';

export function installLib(projectName: string, lib: string) {
  const answer = readline.question(
    `The component you are trying to install requires the library "${lib}". Do you want to install it now? (y/n) `,
    {
      defaultInput: 'y',
    },
  );

  if (answer.toLowerCase() !== 'y') {
    return false;
  }

  const pm = detectPackageManager(projectName);
  const pmCmd = getPmCommands(pm);

  runCommand(`${pmCmd.add} ${lib}`, {
    cwd: getProjectPath(projectName),
  });

  return true;
}
