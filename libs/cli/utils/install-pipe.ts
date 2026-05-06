import { cpSync } from 'node:fs';
import path from 'node:path';
import { getProjectPath } from './project-path';

const originPath = path.join(__dirname, '../../');

export const InstallPipeFlagsList = [] as const;
export type InstallPipeFlags = (typeof InstallPipeFlagsList)[number];

export function installPipe(projectName: string, pipe: InstallPipeFlags) {
  const projectFolder = getProjectPath(projectName);

  cpSync(
    `${originPath}/ui/pipes/${pipe}.pipe.ts`,
    `${projectFolder}/src/app/shared/pipes/${pipe}.pipe.ts`,
  );
}
