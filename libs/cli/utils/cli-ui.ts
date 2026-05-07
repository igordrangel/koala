import { cyan, dim, green, red, yellow } from 'ansis';

type Logger = (message?: string) => void;

export function logHeader(log: Logger, title: string, subtitle?: string) {
  log(cyan('========================================'));
  log(cyan(title));
  if (subtitle) {
    log(dim(subtitle));
  }
  log(cyan('========================================'));
}

export function logStep(log: Logger, message: string) {
  log(cyan(`[STEP] ${message}`));
}

export function logSuccess(log: Logger, message: string) {
  log(green(`[OK] ${message}`));
}

export function logWarning(log: Logger, message: string) {
  log(yellow(`[WARN] ${message}`));
}

export function logError(log: Logger, message: string) {
  log(red(`[FAIL] ${message}`));
}

export function logList(log: Logger, label: string, values: string[]) {
  if (values.length === 0) {
    return;
  }

  log(`${label}: ${values.join(', ')}`);
}
