import chalk from 'chalk';

type Logger = (message?: string) => void;

export function logHeader(log: Logger, title: string, subtitle?: string) {
  log(chalk.cyan('========================================'));
  log(chalk.cyan(title));
  if (subtitle) {
    log(chalk.dim(subtitle));
  }
  log(chalk.cyan('========================================'));
}

export function logStep(log: Logger, message: string) {
  log(chalk.cyan(`[STEP] ${message}`));
}

export function logSuccess(log: Logger, message: string) {
  log(chalk.green(`[OK] ${message}`));
}

export function logWarning(log: Logger, message: string) {
  log(chalk.yellow(`[WARN] ${message}`));
}

export function logError(log: Logger, message: string) {
  log(chalk.red(`[FAIL] ${message}`));
}

export function logList(log: Logger, label: string, values: string[]) {
  if (values.length === 0) {
    return;
  }

  log(`${label} (${values.length}):`);
  for (const value of values) {
    log(`  - ${value}`);
  }
}
