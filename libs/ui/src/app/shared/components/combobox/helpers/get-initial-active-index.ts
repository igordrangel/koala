export function getInitialActiveIndex(optionsLength: number, selectedIndex: number): number {
  if (optionsLength === 0) {
    return -1;
  }

  return selectedIndex >= 0 ? selectedIndex : 0;
}
