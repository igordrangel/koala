import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { detectTestFramework, hasTestsConfigured } from './detect-test-framework';
import { validateAngularProject } from './validate-project';
import { getProjectPath } from './project-path';
import { detectPackageManager, getPmCommands } from './package-manager';
import { runCommand } from './run-command';
import { logStep, logSuccess, logWarning } from './cli-ui';
import { setupGlobalTests } from './setup-global-tests';
import path from 'node:path';

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
  const requiredDirs = [
    'src/app/shared',
    'src/app/shared/components',
    'src/app/shared/directives',
    'src/app/shared/utils',
    'src/app/shared/base',
    'src/theme/icons',
  ];

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
      } catch (err) {
        logWarning(logger, 'Falha ao copiar ícones - continue manualmente se necessário');
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
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

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

  logSuccess(logger, 'Setup concluído com sucesso!');
}
