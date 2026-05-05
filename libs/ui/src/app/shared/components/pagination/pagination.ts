import { Component, computed, effect, input, linkedSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type PaginationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  imports: [FormsModule],
})
export class Pagination {
  private firstLoad = true;

  readonly pageSizeOptions = [10, 20, 30, 50, 100];
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly size = input<PaginationSize>('md');
  readonly page = input<number>(1);
  readonly pageSize = input<number>(10);
  readonly total = input<number>(0);

  readonly currentPage = linkedSignal<number>(this.page);
  readonly currentPageSize = linkedSignal<number>(this.pageSize);
  readonly totalPages = computed(() => Math.ceil(this.total() / this.currentPageSize()));
  readonly totalItemsOnCurrentPage = computed(() => {
    const total = this.total();
    const pageSize = this.currentPageSize();
    const currentPage = this.currentPage();

    if (currentPage * pageSize > total) {
      return total - (currentPage - 1) * pageSize;
    }

    return pageSize * currentPage;
  });
  readonly pages = computed(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return pages
      .filter((page) => page >= currentPage - 1 && (page <= currentPage + 1 || page >= totalPages))
      .reduce((acc, page, index, array) => {
        if (index > 0 && page - array[index - 1] > 1) {
          acc.push(-1);
        }
        acc.push(page);
        return acc;
      }, [] as number[]);
  });

  readonly textSizeClass = computed(() => {
    switch (this.size()) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-md';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
    }
  });

  readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'xs':
        return 'btn-xs';
      case 'sm':
        return 'btn-sm';
      case 'md':
        return 'btn-md';
      case 'lg':
        return 'btn-lg';
      case 'xl':
        return 'btn-xl';
    }
  });

  readonly selectSizeClass = computed(() => {
    switch (this.size()) {
      case 'xs':
        return 'select-xs min-w-14';
      case 'sm':
        return 'select-sm min-w-15';
      case 'md':
        return 'select-md min-w-16';
      case 'lg':
        return 'select-lg min-w-17';
      case 'xl':
        return 'select-xl min-w-18';
    }
  });

  constructor() {
    effect(() => {
      this.pageChange.emit(this.currentPage());
    });

    effect(() => {
      if (this.firstLoad) {
        this.firstLoad = false;
        return;
      }

      this.pageSize();
      this.setPage(1);
    });

    effect(() => {
      this.pageSizeChange.emit(this.currentPageSize());
    });
  }

  setPage(page: number) {
    this.currentPage.set(page);
  }
}
