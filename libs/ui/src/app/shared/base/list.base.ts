import { computed, Directive, effect, input, ResourceRef, signal } from '@angular/core';
import { FilterDefinition, FilterValue } from '../components/filter/filter.models';
import { OrderBy } from '../components/table/ordered-header-col';

export interface DatalistResponse<TDataItem> {
  items: TDataItem[];
  count: number;
}

@Directive()
export abstract class ListBase<TDataItem = any, TQuery = any> {
  protected readonly currentPage = signal<number | null>(1);
  protected readonly pageSize = signal<number | null>(10);
  protected readonly totalItems = signal<number | null>(0);

  protected readonly orderedBy = signal<OrderBy | null>(null);

  protected readonly filter = signal<FilterValue[] | null>(null);

  protected readonly skeletonItems = computed(() => Array.from({ length: this.pageSize() || 10 }));
  protected readonly defaultList: DatalistResponse<TDataItem> = { items: [], count: 0 };

  protected abstract readonly datalist: ResourceRef<DatalistResponse<TDataItem>>;

  readonly reload = input<boolean>(false);

  protected get filterPayload(): TQuery {
    const payload: Partial<TQuery> = {};

    this.filter()?.forEach((item) => {
      payload[item.key as keyof TQuery] = item.value as any;
    });

    return payload as TQuery;
  }

  protected get filterParams() {
    return {
      filter: this.filter(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
      sortBy: this.orderedBy()?.field,
      order: this.orderedBy()?.direction,
    };
  }

  constructor(protected readonly filterDefinitions: FilterDefinition[] = []) {
    effect(() => {
      if (this.reload()) {
        this.datalist.reload();
      }
    });
  }
}
