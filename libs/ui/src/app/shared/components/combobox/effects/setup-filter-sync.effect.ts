import { effect } from '@angular/core';

export function setupFilterSyncEffect(params: {
  inputValue: () => string;
  searchDebounce: () => number;
  consumeSkipNextFilterSync: () => boolean;
  setFilterValue: (value: string) => void;
}) {
  effect((onCleanup) => {
    const value = params.inputValue();
    const debounce = params.searchDebounce();

    if (params.consumeSkipNextFilterSync()) {
      params.setFilterValue('');
      return;
    }

    const timeout = setTimeout(() => {
      params.setFilterValue(value.trim());
    }, debounce);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
