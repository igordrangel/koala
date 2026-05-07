import { effect, Injector, runInInjectionContext, Signal } from '@angular/core';
import { ComboboxResourceFactory, ComboboxResourceResult } from '../combobox';

function isDestroyableResource<TValue, TData>(
  resource: ComboboxResourceResult<TValue, TData>,
): resource is ComboboxResourceResult<TValue, TData> & { destroy(): void } {
  return 'destroy' in resource;
}

export function setupRemoteResourceEffect(params: {
  injector: Injector;
  resourceFactory: () => ComboboxResourceFactory<unknown> | undefined;
  filterSignal: Signal<string>;
  selectedValuesSignal: Signal<unknown[]>;
  setRemoteResource: (resource: ComboboxResourceResult | null) => void;
}) {
  effect((onCleanup) => {
    const factory = params.resourceFactory();
    params.selectedValuesSignal();
    let createdResource: ComboboxResourceResult | null = null;
    let canceled = false;

    params.setRemoteResource(null);

    if (!factory) {
      onCleanup(() => {
        canceled = true;
      });
      return;
    }

    queueMicrotask(() => {
      if (canceled) {
        return;
      }

      const resource = runInInjectionContext(params.injector, () =>
        factory(params.filterSignal, params.selectedValuesSignal),
      );

      if (canceled) {
        if (isDestroyableResource(resource)) {
          resource.destroy();
        }
        return;
      }

      createdResource = resource;
      params.setRemoteResource(resource);
    });

    onCleanup(() => {
      canceled = true;

      if (createdResource && isDestroyableResource(createdResource)) {
        createdResource.destroy();
      }
    });
  });
}
