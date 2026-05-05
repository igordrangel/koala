import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { getProjectPath } from './project-path';

const originPath = path.join(__dirname, '../../');

export type InstallComponentFlags =
  | 'button'
  | 'loading'
  | 'dropdown'
  | 'modal'
  | 'tabs'
  | 'tooltip'
  | 'stepper'
  | 'collapse'
  | 'confirm'
  | 'alert'
  | 'toast'
  | 'side-window';

function copyComponent(projectName: string, component: InstallComponentFlags) {
  const projectFolder = getProjectPath(projectName);
  cpSync(
    `${originPath}/ui/components/${component}`,
    `${projectFolder}/src/app/shared/components/${component}`,
    {
      recursive: true,
    },
  );
}

function getPrefix(projectName: string) {
  const projectFolder = getProjectPath(projectName);
  const angularJsonPath = path.join(projectFolder, 'angular.json');
  const prefix = JSON.parse(readFileSync(angularJsonPath, 'utf-8')).projects[projectName].prefix;

  if (prefix !== 'app') {
    return prefix;
  }

  return null;
}

function getNotInstalledDeps(
  projectName: string,
  deps: InstallComponentFlags[],
): InstallComponentFlags[] {
  const projectFolder = getProjectPath(projectName);
  const notInstalledDeps: InstallComponentFlags[] = [];

  for (const dep of deps) {
    if (!existsSync(`${projectFolder}/src/app/shared/components/${dep}`)) {
      notInstalledDeps.push(dep);
    }
  }

  return notInstalledDeps;
}

export function installComponent(
  projectName: string,
  component: InstallComponentFlags,
): InstallComponentFlags[] {
  const prefix = getPrefix(projectName);
  const projectFolder = getProjectPath(projectName);
  const deps: InstallComponentFlags[] = [];
  const installedDeps: InstallComponentFlags[] = [];

  switch (component) {
    case 'confirm':
    case 'alert':
      deps.push('modal', 'button');
      break;
    case 'toast':
      deps.push('button');
      break;
  }

  for (const dep of getNotInstalledDeps(projectName, deps)) {
    installComponent(projectName, dep);
    installedDeps.push(dep);
  }

  copyComponent(projectName, component);

  if (prefix) {
    const componentTs = readFileSync(
      `${projectFolder}/src/app/shared/components/${component}/${component}.ts`,
      'utf-8',
    );
    writeFileSync(
      `${projectFolder}/src/app/shared/components/${component}/${component}.ts`,
      componentTs.replace(/app/g, prefix),
      'utf-8',
    );
  }

  return installedDeps;
}
