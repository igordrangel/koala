import { setupGithubWorkflowTests } from './setup-github-workflow-tests';
import { setupPlaywright } from './setup-playwright';
import { setupUnitTests } from './setup-unit-tests';

export function setupGlobalTests(projectName: string, verbose = false) {
  setupPlaywright(projectName, verbose);
  setupUnitTests(projectName, verbose);
  setupGithubWorkflowTests(projectName);
}
