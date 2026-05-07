export function getNextActiveIndex(
  currentIndex: number,
  optionsLength: number,
  direction: 'up' | 'down',
): number {
  if (optionsLength === 0) {
    return -1;
  }

  if (direction === 'down') {
    return Math.min(currentIndex + 1, optionsLength - 1);
  }

  return Math.max(currentIndex - 1, 0);
}
