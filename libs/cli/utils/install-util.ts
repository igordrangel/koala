import { cpSync } from 'node:fs';
import path from 'node:path';
import { getProjectPath } from './project-path';

const originPath = path.join(__dirname, '../../');

export const InstallUtilFlagsList = ['string-mask'] as const;
export type InstallUtilFlags = (typeof InstallUtilFlagsList)[number];

export function installUtil(projectName: string, util: InstallUtilFlags) {
  const projectFolder = getProjectPath(projectName);

  cpSync(`${originPath}/ui/utils/${util}.ts`, `${projectFolder}/src/app/shared/utils/${util}.ts`);
}
