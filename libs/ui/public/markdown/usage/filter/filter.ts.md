```typescript
import { Component, resource, signal, Signal } from '@angular/core';
import { ComboboxOption } from '@/shared/components/combobox/combobox';
import {
  DEFAULT_FILTER_I18N,
  Filter,
  FilterDef,
  FilterDefinition,
  FilterI18n,
  FilterValue,
} from '@/shared/components/filter/filter';

@Component({
  selector: 'app-filter-sample',
  templateUrl: './filter-sample.html',
  imports: [Filter],
})
export class FilterSample {
  readonly appliedFilters = signal<FilterValue[]>([]);

  private toUserId(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(`${value}`);
    return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
  }

  private readonly statusOptions: ComboboxOption<string>[] = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'draft', label: 'Draft' },
  ];

  private readonly labelOptions: ComboboxOption<string>[] = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'docs', label: 'Documentation' },
    { value: 'design-system', label: 'Design System' },
  ];

  private readonly typeOptions: ComboboxOption<string>[] = [
    { value: 'feat', label: 'Feature' },
    { value: 'fix', label: 'Fix' },
    { value: 'docs', label: 'Docs' },
    { value: 'refactor', label: 'Refactor' },
  ];

  private readonly usersResourceFactory = (values: Signal<unknown[]>, filter?: Signal<string>) =>
    resource({
      params: () => ({
        selectedValues: values(),
        filter: filter?.() ?? '',
      }),
      defaultValue: [],
      loader: async ({ params, abortSignal }) => {
        const selectedIds = params.selectedValues
          .map((value) => this.toUserId(value))
          .filter((value): value is number => value !== null);

        const query = params.filter.trim();
        const endpoint = query
          ? `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`
          : 'https://dummyjson.com/users?limit=8';

        const baseUsers = await fetch(endpoint, { signal: abortSignal })
          .then((res) => res.json())
          .then((data: { users: { id: number; firstName: string; lastName: string }[] }) =>
            data.users.map(
              (user) =>
                ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                  data: user,
                }) as ComboboxOption<number>,
            ),
          );

        const missingSelectedIds = selectedIds.filter(
          (id) => !baseUsers.some((user) => Object.is(user.value, id)),
        );

        if (missingSelectedIds.length === 0) {
          return baseUsers;
        }

        const selectedUsers = await Promise.all(
          missingSelectedIds.map((id) =>
            fetch(`https://dummyjson.com/users/${id}`, { signal: abortSignal })
              .then((res) => (res.ok ? res.json() : null))
              .then((user: { id: number; firstName: string; lastName: string } | null) =>
                user
                  ? ({
                      label: `${user.firstName} ${user.lastName}`,
                      value: user.id,
                      data: user,
                    } as ComboboxOption<number>)
                  : null,
              ),
          ),
        );

        return [
          ...baseUsers,
          ...selectedUsers.filter((user): user is ComboboxOption<number> => !!user),
        ];
      },
    });

  readonly filterI18n: FilterI18n = {
    ...DEFAULT_FILTER_I18N,
    placeholder: 'Choose a filter type',
  };

  readonly filterDefinitions: FilterDefinition[] = [
    FilterDef.text('author', 'Author').placeholder('e.g. john').build(),
    FilterDef.cpf('cpf', 'CPF').build(),
    FilterDef.cnpj('cnpj', 'CNPJ').build(),
    FilterDef.select('status', 'Status').options(this.statusOptions).build(),
    FilterDef.selectMultiple('labels', 'Labels').options(this.labelOptions).build(),
    FilterDef.combobox('type', 'Type').options(this.typeOptions).build(),
    FilterDef.combobox('assignee', 'Assignee')
      .placeholder('Search user...')
      .resourceFactory(this.usersResourceFactory)
      .build(),
    FilterDef.date('created', 'Created after').build(),
    FilterDef.number('min-comments', 'Min comments').placeholder('0').build(),
    FilterDef.email('contact', 'Contact e-mail').build(),
  ];

  handleFiltersChange(filters: FilterValue[]) {
    this.appliedFilters.set(filters);
  }
}
```
