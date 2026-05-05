import { Component, effect, signal } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Table } from '../../../shared/components/table';
import { Tabs } from '../../../shared/components/tabs';
import { KlArray } from '@koalarx/utils/KlArray';
import { OrderBy } from '@/shared/components/table/ordered-header-col';

interface OrderedTableData {
  name: string;
  job: string;
  favoriteColor: string;
}

@Component({
  selector: 'app-table-page',
  templateUrl: './table.page.html',
  imports: [Section, Tabs, Table],
})
export class TablePage {
  readonly orderedBy = signal<OrderBy | null>(null);
  readonly orderedTableData = signal<KlArray<OrderedTableData>>(
    new KlArray<OrderedTableData>([
      { name: 'John Doe', job: 'Software Engineer', favoriteColor: 'Blue' },
      { name: 'Cy Ganderton', job: 'Quality Control Specialist', favoriteColor: 'Purple' },
      { name: 'Brice Swyre', job: 'Tax Accountant', favoriteColor: 'Red' },
    ]),
  );

  constructor() {
    effect(() => {
      const orderBy = this.orderedBy();

      if (orderBy) {
        this.orderedTableData.update((data) => {
          return data.orderBy(orderBy.field, orderBy.direction);
        });
      }
    });
  }
}
