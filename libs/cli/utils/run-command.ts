import { SpawnSyncOptions, spawnSync } from 'node:child_process';

export interface RunCommandOptions extends SpawnSyncOptions {
  verbose?: boolean;
}

export function runCommand(command: string, options: RunCommandOptions = {}) {
  const { verbose = true, ...spawnOptions } = options;

  const result = spawnSync(command, {
    ...spawnOptions,
    encoding: 'utf-8',
    shell: true,
    stdio: verbose ? 'inherit' : 'pipe',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    if (!verbose) {
      const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
      if (output) {
        throw new Error(
          `Command failed with exit code ${result.status}: ${command}\n${output}`,
        );
      }
    }

    throw new Error(`Command failed with exit code ${result.status}: ${command}`);
  }

  return result;
}
