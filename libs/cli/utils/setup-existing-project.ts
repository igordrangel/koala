import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { logStep, logSuccess, logWarning } from './cli-ui';
import { detectTestFramework } from './detect-test-framework';
import { detectPackageManager, getPmCommands } from './package-manager';
import { getProjectPath } from './project-path';
import { runCommand } from './run-command';
import { setupGlobalTests } from './setup-global-tests';
import { validateAngularProject } from './validate-project';
import { installUtil } from './install-util';

const originPath = path.join(__dirname, '../../');

/**
 * Realiza setup adaptativo de um projeto Angular pré-existente
 */
export async function setupExistingProject(projectName: string, verbose = false): Promise<void> {
  const logger = console.log;
  const projectPath = getProjectPath(projectName);

  // Validar projeto
  logStep(logger, 'Validando projeto Angular...');
  const validation = validateAngularProject(projectName);

  if (!validation.isValid) {
    const errorMsg = validation.errors.join('\n  - ');
    throw new Error(`Projeto inválido:\n  - ${errorMsg}`);
  }

  logSuccess(logger, 'Projeto Angular válido');

  // Criar estrutura de pastas compartilhada
  logStep(logger, 'Criando estrutura de pastas...');
  const requiredDirs = ['src/app/shared', 'src/theme/icons'];

  for (const dir of requiredDirs) {
    const fullPath = `${projectPath}/${dir}`;
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  logSuccess(logger, 'Estrutura de pastas criada/verificada');

  // Copiar temas e ícones se não existirem
  logStep(logger, 'Configurando temas...');
  const themeIconsPath = `${projectPath}/src/theme/icons`;
  const originIconsPath = `${originPath}/ui/theme/icons`;

  if (!existsSync(`${themeIconsPath}/font-awesome`)) {
    if (existsSync(originIconsPath)) {
      try {
        cpSync(`${originIconsPath}`, `${themeIconsPath}`, { recursive: true });
        logSuccess(logger, 'Ícones copiados');
      } catch {
        logWarning(logger, 'Falha ao copiar ícones - continue manualmente se necessário');
      }
    }
  }

  const gridPath = `${projectPath}/src/theme/grid.css`;
  if (!existsSync(gridPath)) {
    const originGridPath = `${originPath}/ui/theme/grid.css`;
    if (existsSync(originGridPath)) {
      try {
        cpSync(originGridPath, gridPath);
      } catch {
        logWarning(logger, 'Falha ao copiar grid.css');
      }
    }
  }

  const animationsPath = `${projectPath}/src/theme/animations.css`;
  if (!existsSync(animationsPath)) {
    const originAnimationsPath = `${originPath}/ui/theme/animations.css`;
    if (existsSync(originAnimationsPath)) {
      try {
        cpSync(originAnimationsPath, animationsPath);
      } catch {
        logWarning(logger, 'Falha ao copiar animations.css');
      }
    }
  }

  const tablePath = `${projectPath}/src/theme/table.css`;
  if (!existsSync(tablePath)) {
    const originTablePath = `${originPath}/ui/theme/table.css`;
    if (existsSync(originTablePath)) {
      try {
        cpSync(originTablePath, tablePath);
      } catch {
        logWarning(logger, 'Falha ao copiar table.css');
      }
    }
  }

  mkdirSync(`${projectPath}/public/assets/icons`, { recursive: true });

  const generateIconsPath = `${projectPath}/generate-icons.js`;
  if (!existsSync(generateIconsPath)) {
    const originGenerateIconsPath = `${originPath}/ui/generate-icons.js`;
    if (existsSync(originGenerateIconsPath)) {
      try {
        cpSync(originGenerateIconsPath, generateIconsPath);
      } catch {
        logWarning(logger, 'Falha ao copiar generate-icons.js');
      }
    }
  }

  // Detectar testes já configurados
  logStep(logger, 'Detectando testes já configurados...');
  const testConfig = detectTestFramework(projectName);

  if (testConfig.unit !== 'none' || testConfig.e2e !== 'none') {
    logSuccess(logger, `Testes encontrados: Unit=${testConfig.unit}, E2E=${testConfig.e2e}`);
  } else {
    logWarning(logger, 'Nenhum teste configurado encontrado. Configurando testes padrão...');

    // Instalar dependências de teste
    await setupGlobalTests(projectName, verbose);
    logSuccess(logger, 'Testes configurados');
  }

  // Verificar e instalar dependências base
  logStep(logger, 'Verificando dependências...');
  const packageJsonPath = `${projectPath}/package.json`;
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    scripts: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  if (!packageJson.scripts.prestart) {
    packageJson.scripts.prestart = 'node generate-icons.js';
  }

  if (!packageJson.scripts.prebuild) {
    packageJson.scripts.prebuild = 'node generate-icons.js';
  }

  if (!packageJson.scripts['build:dev']) {
    packageJson.scripts['build:dev'] =
      'node generate-icons.js && ng build --configuration development';
  }

  if (!packageJson.scripts['build:prod']) {
    packageJson.scripts['build:prod'] =
      'node generate-icons.js && ng build --configuration production';
  }

  writeFileSync(`${packageJsonPath}`, JSON.stringify(packageJson, null, 2));

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const requiredDeps = ['@koalarx/utils', 'clsx'];
  const missingDeps = requiredDeps.filter((dep) => !allDeps[dep]);

  if (missingDeps.length > 0) {
    logStep(logger, `Instalando dependências base: ${missingDeps.join(', ')}...`);
    const pm = getPmCommands(detectPackageManager(projectName));
    await runCommand(`${pm.install} ${missingDeps.join(' ')}`, {
      cwd: projectPath,
      verbose,
      loaderText: 'Instalando dependências base',
    });
    logSuccess(logger, 'Dependências base instaladas');
  } else {
    logSuccess(logger, 'Todas as dependências base já estão instaladas');
  }

  // Verificar ESLint
  logStep(logger, 'Verificando configuração de linting...');
  const eslintConfigPath = `${projectPath}/eslint.config.mts`;
  if (!existsSync(eslintConfigPath)) {
    const originEslintPath = `${originPath}/ui/eslint.config.mts`;
    if (existsSync(originEslintPath)) {
      try {
        cpSync(originEslintPath, eslintConfigPath);
        logSuccess(logger, 'Configuração ESLint copiada');
      } catch {
        logWarning(logger, 'Falha ao copiar eslint.config.mts');
      }
    }
  } else {
    logSuccess(logger, 'ESLint já configurado');
  }

  // Configurar VS Code settings
  logStep(logger, 'Verificando configuração VS Code...');
  const vscodeDir = `${projectPath}/.vscode`;
  const vscodeSettingsPath = `${vscodeDir}/settings.json`;
  const originVscodeSettingsPath = `${originPath}/ui/.vscode/settings.json`;

  if (!existsSync(vscodeSettingsPath) && existsSync(originVscodeSettingsPath)) {
    try {
      mkdirSync(vscodeDir, { recursive: true });
      cpSync(originVscodeSettingsPath, vscodeSettingsPath);
      logSuccess(logger, 'Configuração VS Code copiada');
    } catch {
      logWarning(logger, 'Falha ao copiar settings.json do VS Code');
    }
  } else if (existsSync(vscodeSettingsPath)) {
    logSuccess(logger, 'VS Code já configurado');
  }

  installUtil(projectName, 'control-changes');

  logSuccess(logger, 'Setup concluído com sucesso!');
}
