import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { getPrefix } from './get-prefix';
import { getProjectPath } from './project-path';
import { InstallValidatorFlags } from './install-validator';
import { InstallDirectiveFlags } from './install-directive';
import { InstallUtilFlags } from './install-util';
import { InstallBaseFlags } from './install-base';

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
  'currency',
  'checkbox',
  'radio',
  'toggle',
  'range',
  'select',
  'combobox',
  'filter',
  'datatable',
] as const;
export type InstallComponentFlags = (typeof InstallComponentFlagsList)[number];

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

export function installComponent(projectName: string, component: InstallComponentFlags) {
  const prefix = getPrefix(projectName);
  const projectFolder = getProjectPath(projectName);
  const componentFolderPath = `${projectFolder}/src/app/shared/components/${component}`;
  const componentOriginPath = `${originPath}/ui/components/${component}`;

  const componentDeps: InstallComponentFlags[] = [];
  const libDeps: string[] = [];
  const validatorDeps: InstallValidatorFlags[] = [];
  const directiveDeps: InstallDirectiveFlags[] = [];
  const utilDeps: InstallUtilFlags[] = [];
  const baseDeps: InstallBaseFlags[] = [];

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
      componentDeps.push('input-field');
      directiveDeps.push('mask');
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
    case 'currency':
      directiveDeps.push('currency');
      utilDeps.push('currency-mask');
      break;
    case 'combobox':
      libDeps.push('@angular/aria');
      utilDeps.push(
        'find-item-by-value',
        'has-item-with-value',
        'remove-item-by-value',
        'toggle-item-by-value',
        'map-items-by-values',
        'are-items-equal-by-value',
      );
      componentDeps.push('loading');
      break;
    case 'select':
      utilDeps.push('find-item-by-value', 'toggle-primitive-value');
      break;
    case 'filter':
      componentDeps.push(
        'combobox',
        'select',
        'loading',
        'calendar',
        'input-field',
        'input-cpf',
        'input-cnpj',
        'currency',
      );
      break;
    case 'pagination':
      componentDeps.push('select');
      break;
    case 'datatable':
      componentDeps.push('filter', 'button', 'table', 'pagination');
      baseDeps.push('list');
      break;
  }

  if (existsSync(componentOriginPath)) {
    cpSync(componentOriginPath, componentFolderPath, {
      recursive: true,
    });

    if (prefix) {
      configPrefix(componentFolderPath, prefix);
    }
  }

  return {
    componentDeps,
    libDeps,
    validatorDeps,
    directiveDeps,
    utilDeps,
    baseDeps,
  };
}
