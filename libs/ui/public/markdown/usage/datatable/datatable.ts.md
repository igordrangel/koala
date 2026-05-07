```typescript
import { Component, resource } from '@angular/core';
import { Validators } from '@angular/forms';
import { KlArray } from '@koalarx/utils/KlArray';
import { ListBase } from '@/shared/base/list.base';
import { Button } from '@/shared/components/button/button';
import { Filter, FilterDef } from '@/shared/components/filter/filter';
import { Loading } from '@/shared/components/loading/loading';
import { Pagination } from '@/shared/components/pagination/pagination';
import { Skeleton } from '@/shared/components/skeleton/skeleton';
import { Table } from '@/shared/components/table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  eyeColor: string;
}

@Component({
  selector: 'app-datatable-sample',
  templateUrl: './datatable-sample.html',
  imports: [Filter, Table, Pagination, Skeleton, Button, Loading],
})
export class DatatableSample extends ListBase<User> {
  constructor() {
    super([
      FilterDef.text('name', 'Name').build(),
      FilterDef.text('email', 'Email').validators(Validators.email).build(),
    ]);

    this.orderedBy.set({ field: 'firstName', direction: 'asc' });
  }

  protected override datalist = resource({
    params: () => ({
      filter: this.filter(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
      sortBy: this.orderedBy()?.field,
      order: this.orderedBy()?.direction,
    }),
    defaultValue: this.defaultList,
    loader: async ({ params, abortSignal }) => {
      const page = params.page ?? 1;
      const sortBy = params.sortBy ?? 'firstName';
      const order = params.order ?? 'asc';

      const endpoint = `https://dummyjson.com/users?limit=300&sortBy=${sortBy}&order=${order}`;

      const response = await fetch(endpoint, { signal: abortSignal });
      const data: { users: User[]; total: number } = await response.json();

      function getFilter(key: string) {
        return params.filter?.find((f) => f.key === key);
      }

      const users = new KlArray<User>(
        data.users.filter((item) => {
          const nameFilter = getFilter('name');
          const emailFilter = getFilter('email');

          return (
            (!nameFilter ||
              item.firstName.includes(nameFilter.value as string) ||
              item.lastName.includes(nameFilter.value as string)) &&
            (!emailFilter || item.email === (emailFilter.value as string))
          );
        }),
      );

      const totalItems = users.length;
      const limitedItems = users.split(params.pageSize ?? 10)[page - 1];

      this.totalItems.set(totalItems);

      return {
        items: [...limitedItems],
        count: limitedItems.length,
      };
    },
  });
}
```
