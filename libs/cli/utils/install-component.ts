import { cpSync, readFileSync, writeFileSync } from 'node:fs';

export type InstallComponentFlags = 'button' | 'loading';

function copyComponent(projectName: string, component: InstallComponentFlags) {
  cpSync(
    `./dist/ui/components/${component}`,
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
    case 'button':
    case 'loading':
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
