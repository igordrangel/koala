import { existsSync, readFileSync } from 'node:fs';
import { getProjectPath } from './project-path';

export interface ProjectValidation {
  isValid: boolean;
  isAngular: boolean;
  isStandalone: boolean;
  hasPackageJson: boolean;
  hasTsConfig: boolean;
  errors: string[];
}

/**
 * Valida se o projeto é um projeto Angular válido
 */
export function validateAngularProject(projectName: string): ProjectValidation {
  const projectPath = getProjectPath(projectName);
  const errors: string[] = [];

  // Verificar package.json
  const packageJsonPath = `${projectPath}/package.json`;
  const hasPackageJson = existsSync(packageJsonPath);

  if (!hasPackageJson) {
    errors.push('package.json não encontrado');
    return {
      isValid: false,
      isAngular: false,
      isStandalone: false,
      hasPackageJson: false,
      hasTsConfig: false,
      errors,
    };
  }

  let packageJson;
  try {
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  } catch (err) {
    errors.push('Erro ao ler package.json');
    return {
      isValid: false,
      isAngular: false,
      isStandalone: false,
      hasPackageJson: true,
      hasTsConfig: false,
      errors,
    };
  }

  // Verificar se tem Angular
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const isAngular = !!allDeps['@angular/core'];

  if (!isAngular) {
    errors.push('@angular/core não encontrado em dependências');
  }

  // Verificar tsconfig.json
  const tsconfigPath = `${projectPath}/tsconfig.json`;
  const hasTsConfig = existsSync(tsconfigPath);

  if (!hasTsConfig) {
    errors.push('tsconfig.json não encontrado');
  }

  // Verificar src/main.ts
  const mainTsPath = `${projectPath}/src/main.ts`;
  const hasMainTs = existsSync(mainTsPath);

  if (!hasMainTs) {
    errors.push('src/main.ts não encontrado');
  }

  // Detectar se é standalone (verificar bootstrapApplication vs bootstrapModule)
  let isStandalone = false;
  if (hasMainTs) {
    try {
      const mainContent = readFileSync(mainTsPath, 'utf-8');
      isStandalone = mainContent.includes('bootstrapApplication');
    } catch {
      // ignorar erro ao ler
    }
  }

  const isValid = isAngular && hasTsConfig && hasMainTs;

  return {
    isValid,
    isAngular,
    isStandalone,
    hasPackageJson,
    hasTsConfig,
    errors: isValid ? [] : errors,
  };
}
