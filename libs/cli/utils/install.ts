import { InstallResult } from '../models/install-result';
import { getNotInstalled } from './get-not-installed';
import { installBase, InstallBaseFlags } from './install-base';
import { installComponent, InstallComponentFlags } from './install-component';
import { installDirective, InstallDirectiveFlags } from './install-directive';
import { installLib } from './install-lib';
import { setupComponentTests } from './setup-component-tests';
import { installUtil, InstallUtilFlags } from './install-util';
import { installValidator, InstallValidatorFlags } from './install-validator';

export async function install(
  projectName: string,
  component: InstallComponentFlags,
): Promise<InstallResult> {
  const installedComponentDeps: InstallComponentFlags[] = [];
  const installedLibDeps: string[] = [];
  const missingLibDeps: string[] = [];
  const installedValidatorDeps: InstallValidatorFlags[] = [];
  const installedDirectiveDeps: InstallDirectiveFlags[] = [];
  const installedUtilDeps: InstallUtilFlags[] = [];
  const installedBaseDeps: InstallBaseFlags[] = [];

  const deps = installComponent(projectName, component);

  for (const dep of getNotInstalled(projectName, 'lib', deps.libDeps)) {
    const installed = await installLib(projectName, dep);

    if (installed) {
      installedLibDeps.push(dep);
    } else {
      missingLibDeps.push(dep);
    }
  }

  for (const dep of getNotInstalled(projectName, 'utils', deps.utilDeps)) {
    installUtil(projectName, dep);
    installedUtilDeps.push(dep);
  }

  for (const dep of getNotInstalled(projectName, 'validator', deps.validatorDeps)) {
    installValidator(projectName, dep);
    installedValidatorDeps.push(dep);
  }

  for (const dep of getNotInstalled(projectName, 'directives', deps.directiveDeps)) {
    installDirective(projectName, dep);
    installedDirectiveDeps.push(dep);
  }

  for (const dep of getNotInstalled(projectName, 'base', deps.baseDeps)) {
    installBase(projectName, dep);
    installedBaseDeps.push(dep);
  }

  for (const component of getNotInstalled(projectName, 'component', deps.componentDeps)) {
    const result = await install(projectName, component);
    installedComponentDeps.push(...result.components, component);
    installedLibDeps.push(...result.libs);
    installedUtilDeps.push(...result.utils);
    installedValidatorDeps.push(...result.validators);
    installedDirectiveDeps.push(...result.directives);
    installedBaseDeps.push(...result.base);
    missingLibDeps.push(...result.missingLibs);
  }

  setupComponentTests(projectName);

  return {
    components: [...new Set(installedComponentDeps)],
    libs: [...new Set(installedLibDeps)],
    validators: [...new Set(installedValidatorDeps)],
    directives: [...new Set(installedDirectiveDeps)],
    utils: [...new Set(installedUtilDeps)],
    base: [...new Set(installedBaseDeps)],
    missingLibs: [...new Set(missingLibDeps)],
  };
}
