import { mkdirSync } from 'node:fs';
import { getProjectPath } from './project-path';

export type InstallResourceFlags = 'base' | 'auth' | 'error-handler';

export function installResource(projectName: string, resource: InstallResourceFlags) {
  const projectFolder = getProjectPath(projectName);
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
    mkdirSync(`${projectFolder}/src/app/core/${folder}`, { recursive: true });
  }
}
