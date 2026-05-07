import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { detectPackageManager, getPmCommands } from './package-manager';
import { getProjectPath } from './project-path';
import { runCommand } from './run-command';

const VITEST_CONFIG = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.unit.spec.ts'],
    environment: 'node',
    globals: true,
    reporters: ['default'],
  },
});
`;

function ensureUnitTestDependencies(projectName: string) {
  const projectPath = getProjectPath(projectName);
  const packageJsonPath = `${projectPath}/package.json`;
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    devDependencies?: Record<string, string>;
    dependencies?: Record<string, string>;
  };

  const missingDeps: string[] = [];

  const hasVitest = packageJson.devDependencies?.vitest || packageJson.dependencies?.vitest;
  const hasJsdom = packageJson.devDependencies?.jsdom || packageJson.dependencies?.jsdom;

  if (!hasVitest) {
    missingDeps.push('vitest');
  }

  if (!hasJsdom) {
    missingDeps.push('jsdom');
  }

  if (missingDeps.length === 0) {
    return;
  }

  const pm = getPmCommands(detectPackageManager(projectName));
  runCommand(`cd ${projectPath} && ${pm.installDev} ${missingDeps.join(' ')}`);
}

function ensureUnitTestScripts(projectName: string) {
  const projectPath = getProjectPath(projectName);
  const packageJsonPath = `${projectPath}/package.json`;
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    scripts?: Record<string, string>;
  };

  packageJson.scripts ??= {};
  packageJson.scripts['test:unit'] ??= 'vitest run';
  packageJson.scripts['test:unit:watch'] ??= 'vitest';

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function ensureUnitTestConfig(projectName: string) {
  const projectPath = getProjectPath(projectName);
  const configPath = `${projectPath}/vitest.config.ts`;

  if (existsSync(configPath)) {
    return;
  }

  writeFileSync(configPath, VITEST_CONFIG);
}

export function setupUnitTests(projectName: string) {
  ensureUnitTestDependencies(projectName);
  ensureUnitTestScripts(projectName);
  ensureUnitTestConfig(projectName);
}
