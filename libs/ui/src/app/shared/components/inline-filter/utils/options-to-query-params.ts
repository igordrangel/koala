import { InlineFilterField } from '../config';

export function optionsToQueryParams(options: InlineFilterField[]) {
  return options.reduce(
    (acc, option) => {
      if (option.value) {
        acc[option.name] = option.value();
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}
