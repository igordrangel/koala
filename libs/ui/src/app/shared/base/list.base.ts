import { computed, Directive, effect, inject, input, ResourceRef, signal } from '@angular/core';
import { InlineFilterBuilder } from '../components/inline-filter';
import { OrderBy } from '../components/table/ordered-header-col';

export interface DatalistResponse<TDataItem> {
  items: TDataItem[];
  count: number;
}

@Directive()
export abstract class ListBase<TDataItem = any, TFilterPayload = Record<string, any>> {
  protected readonly inlineFilterBuilder = inject(InlineFilterBuilder);

  protected readonly currentPage = signal<number | null>(1);
  protected readonly pageSize = signal<number | null>(30);
  protected readonly totalItems = signal<number | null>(0);
  protected readonly orderedBy = signal<OrderBy | null>(null);
  protected readonly filter = signal<any[] | null>(null);

  protected readonly skeletonItems = computed(() => Array.from({ length: 10 }));
  protected readonly defaultList: DatalistResponse<TDataItem> = { items: [], count: 0 };

  protected get filterPayload() {
    const payload: Record<string, any> = {};

    this.filter()?.forEach((item) => {
      payload[item.key] = item.value;
    });

    return payload as TFilterPayload;
  }

  protected get filterParams() {
    return {
      filter: this.filterPayload,
      page: this.currentPage() ?? 1,
      pageSize: this.pageSize() ?? 10,
      sortBy: this.orderedBy()?.field,
      order: this.orderedBy()?.direction,
    };
  }

  protected abstract readonly datalist: ResourceRef<DatalistResponse<TDataItem>>;

  readonly reload = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.reload()) {
        this.datalist.reload();
      }
    });
  }

  reloadList() {
    this.datalist.reload();
  }
}
