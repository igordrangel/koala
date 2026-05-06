import { spawnSync } from 'node:child_process';
import { getProjectPath } from './project-path';
import readline from 'readline-sync';

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

  spawnSync('bun', ['add', lib], {
    cwd: getProjectPath(projectName),
    stdio: 'inherit',
  });

  return true;
}
