import { SpawnSyncOptions, spawnSync } from 'node:child_process';

export function runCommand(command: string, options: SpawnSyncOptions = {}) {
  const result = spawnSync(command, {
    ...options,
    encoding: 'utf-8',
    shell: true,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}: ${command}`);
  }

  return result;
}
