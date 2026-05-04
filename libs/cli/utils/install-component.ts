import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const originPath = path.join(__dirname, '../../');

export type InstallComponentFlags =
  | 'button'
  | 'loading'
  | 'dropdown'
  | 'modal'
  | 'tabs'
  | 'tooltip'
  | 'stepper'
  | 'collapse';

function copyComponent(projectName: string, component: InstallComponentFlags) {
  cpSync(
    `${originPath}/ui/components/${component}`,
    `${projectName}/src/app/shared/components/${component}`,
    { recursive: true },
  );
}

function getPrefix(projectName: string) {
  const prefix = JSON.parse(readFileSync(`${projectName}/angular.json`, 'utf-8')).projects[
    projectName
  ].prefix;

  if (prefix !== 'app') {
    return prefix;
  }

  return null;
}

export function installComponent(projectName: string, component: InstallComponentFlags) {
  switch (component) {
    default:
      copyComponent(projectName, component);

      const prefix = getPrefix(projectName);

      if (prefix) {
        const buttonTs = readFileSync(
          `${projectName}/src/app/shared/components/${component}/${component}.ts`,
          'utf-8',
        );
        writeFileSync(
          `${projectName}/src/app/shared/components/${component}/${component}.ts`,
          buttonTs.replace(/app/g, prefix),
          'utf-8',
        );
      }
      break;
  }
}
