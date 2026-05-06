import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { InstallResult } from '../models/install-result';
import { getNotInstalled } from './get-not-installed';
import { getPrefix } from './get-prefix';
import { installDirective, InstallDirectiveFlags } from './install-directive';
import { installLib } from './install-lib';
import { installPipe, InstallPipeFlags } from './install-pipe';
import { installValidator, InstallValidatorFlags } from './install-validator';
import { getProjectPath } from './project-path';
import { installUtil, InstallUtilFlags } from './install-util';

const originPath = path.join(__dirname, '../../');

export const InstallComponentFlagsList = [
  'button',
  'loading',
  'dropdown',
  'modal',
  'tabs',
  'tooltip',
  'stepper',
  'collapse',
  'confirm',
  'alert',
  'toast',
  'side-window',
  'table',
  'skeleton',
  'pagination',
  'breadcrumb',
  'fieldset',
  'validator',
  'input-field',
  'textarea',
  'calendar',
  'input-cpf',
  'input-cnpj',
  'input-currency',
  'checkbox',
  'radio',
  'toggle',
  'range',
  'select',
  'combobox',
] as const;
export type InstallComponentFlags = (typeof InstallComponentFlagsList)[number];

function copyComponent(projectName: string, component: InstallComponentFlags) {
  const prefix = getPrefix(projectName);
  const projectFolder = getProjectPath(projectName);
  const componentFolderPath = `${projectFolder}/src/app/shared/components/${component}`;
  const componentOriginPath = `${originPath}/ui/components/${component}`;

  if (existsSync(componentOriginPath)) {
    cpSync(componentOriginPath, componentFolderPath, {
      recursive: true,
    });

    if (prefix) {
      configPrefix(componentFolderPath, prefix);
    }
  }
}

function configPrefix(componentFolderPath: string, prefix: string) {
  const files = readdirSync(componentFolderPath);

  for (const file of files) {
    const filePath = `${componentFolderPath}/${file}`;
    const stat = readdirSync(filePath, { withFileTypes: true });

    if (stat.some((s) => s.isDirectory())) {
      const subFiles = readdirSync(filePath);

      for (const subFile of subFiles) {
        const subFilePath = `${filePath}/${subFile}`;
        const subStat = readdirSync(subFilePath, { withFileTypes: true });

        if (subStat.some((s) => s.isDirectory())) {
          configPrefix(subFilePath, prefix);
        } else {
          const subFileTs = readFileSync(subFilePath, 'utf-8');
          writeFileSync(subFilePath, subFileTs.replace(/app/g, prefix), 'utf-8');
        }
      }
    } else {
      const fileTs = readFileSync(filePath, 'utf-8');
      writeFileSync(filePath, fileTs.replace(/app/g, prefix), 'utf-8');
    }
  }
}

export function installComponent(
  projectName: string,
  component: InstallComponentFlags,
): InstallResult {
  const componentDeps: InstallComponentFlags[] = [];
  const libDeps: string[] = [];
  const pipeDeps: InstallPipeFlags[] = [];
  const validatorDeps: InstallValidatorFlags[] = [];
  const directiveDeps: InstallDirectiveFlags[] = [];
  const utilDeps: InstallUtilFlags[] = [];

  const installedComponentDeps: InstallComponentFlags[] = [];
  const installedLibDeps: string[] = [];
  const installedPipeDeps: InstallPipeFlags[] = [];
  const installedValidatorDeps: InstallValidatorFlags[] = [];
  const installedDirectiveDeps: InstallDirectiveFlags[] = [];
  const installedUtilDeps: InstallUtilFlags[] = [];

  switch (component) {
    case 'confirm':
    case 'alert':
      componentDeps.push('modal', 'button');
      break;
    case 'toast':
      componentDeps.push('button');
      break;
    case 'calendar':
      libDeps.push('cally');
      break;
    case 'input-cpf':
    case 'input-cnpj':
      if (component === 'input-cpf') {
        validatorDeps.push('cpf');
      } else {
        validatorDeps.push('cnpj');
      }

      directiveDeps.push('mask');
      utilDeps.push('string-mask');

      componentDeps.push('input-field');
      break;
    case 'combobox':
      libDeps.push('@angular/aria');
      componentDeps.push('loading');
      break;
  }

  for (const dep of getNotInstalled(projectName, 'lib', libDeps)) {
    const installed = installLib(projectName, dep);

    if (installed) {
      installedLibDeps.push(dep);
    } else {
      console.warn(
        `The library "${dep}" is required for the "${component}" component to work properly. Please install it as soon as possible.`,
      );
    }
  }

  for (const dep of getNotInstalled(projectName, 'utils', utilDeps)) {
    installUtil(projectName, dep);
    installedUtilDeps.push(dep);
  }

  for (const dep of getNotInstalled(projectName, 'pipe', pipeDeps)) {
    installPipe(projectName, dep);
    installedPipeDeps.push(dep);
  }

  for (const dep of getNotInstalled(projectName, 'validator', validatorDeps)) {
    installValidator(projectName, dep);
    installedValidatorDeps.push(dep);
  }

  for (const dep of getNotInstalled(projectName, 'directives', directiveDeps)) {
    installDirective(projectName, dep);
    installedDirectiveDeps.push(dep);
  }

  for (const dep of getNotInstalled(projectName, 'component', componentDeps)) {
    installComponent(projectName, dep);
    installedComponentDeps.push(dep);
  }

  copyComponent(projectName, component);

  return {
    components: installedComponentDeps,
    libs: installedLibDeps,
    pipes: installedPipeDeps,
    validators: installedValidatorDeps,
    directives: installedDirectiveDeps,
    utils: installedUtilDeps,
  };
}
