import { mkdirSync } from 'node:fs';

export type InstallResourceFlags = 'base' | 'auth' | 'error-handler';

export function installResource(projectName: string, resource: InstallResourceFlags) {
  const folders: string[] = [];

  switch (resource) {
    case 'base':
      folders.push('base');
      break;
    case 'auth':
      folders.push('guards', 'interceptors');
      break;
    case 'error-handler':
      folders.push('utils', 'middlewares');
      break;
  }

  for (const folder of folders) {
    mkdirSync(`src/app/core/${folder}`, { recursive: true });
  }
}
