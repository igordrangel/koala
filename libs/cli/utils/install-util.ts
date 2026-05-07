import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';
import { getProjectPath } from './project-path';

const originPath = path.join(__dirname, '../../');

export const InstallUtilFlagsList = [
  'string-mask',
  'currency-mask',
  'find-item-by-value',
  'has-item-with-value',
  'remove-item-by-value',
  'toggle-item-by-value',
  'map-items-by-values',
  'are-items-equal-by-value',
  'toggle-primitive-value',
] as const;
export type InstallUtilFlags = (typeof InstallUtilFlagsList)[number];

export function installUtil(projectName: string, util: InstallUtilFlags) {
  const projectFolder = getProjectPath(projectName);
  const originUtilPath = `${originPath}/ui/utils/${util}.ts`;
  const originSpecPath = `${originPath}/ui/utils/${util}.unit.spec.ts`;
  const targetFolder = `${projectFolder}/src/app/shared/utils`;

  cpSync(originUtilPath, `${targetFolder}/${util}.ts`);

  if (existsSync(originSpecPath)) {
    cpSync(originSpecPath, `${targetFolder}/${util}.unit.spec.ts`);
  }
}
