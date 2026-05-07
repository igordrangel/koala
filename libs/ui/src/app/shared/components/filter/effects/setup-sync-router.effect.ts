import { effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterDefinition, FilterValue } from '../filter.models';
import { buildQueryParams } from '../filter.storage';

export function setupSyncRouterEffect(params: {
  hydrationComplete: () => boolean;
  resolvedValues: () => FilterValue[];
  definitions: () => FilterDefinition[];
  emitFiltersChange: (values: FilterValue[]) => void;
  router: Router;
  route: ActivatedRoute;
}) {
  effect(() => {
    if (!params.hydrationComplete()) {
      return;
    }

    const values = params.resolvedValues();
    params.emitFiltersChange(values);

    const allKeys = params.definitions().map((d) => d.key);
    params.router.navigate([], {
      relativeTo: params.route,
      queryParams: buildQueryParams(values, allKeys),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });
}
