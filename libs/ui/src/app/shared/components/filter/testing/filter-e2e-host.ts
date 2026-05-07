import { JsonPipe } from '@angular/common';
import { Component, resource, Signal, signal } from '@angular/core';
import { ComboboxOption } from '../../combobox/combobox';
import { Filter, FilterDef, FilterDefinition, FilterValue } from '../filter';

@Component({
  selector: 'app-filter-e2e-host',
  templateUrl: './filter-e2e-host.html',
  imports: [JsonPipe, Filter],
})
export class FilterE2EHostComponent {
  readonly appliedFilters = signal<FilterValue[]>([]);
  private readonly userOptionCache = new Map<number, ComboboxOption<number>>();

  private toUserOption(user: {
    id: number;
    firstName: string;
    lastName: string;
  }): ComboboxOption<number> {
    const option: ComboboxOption<number> = {
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
      data: user,
    };

    this.userOptionCache.set(option.value, option);
    return option;
  }

  private async getUserOptionById(
    id: number,
    abortSignal: AbortSignal,
  ): Promise<ComboboxOption<number> | null> {
    const cached = this.userOptionCache.get(id);
    if (cached) {
      return cached;
    }

    return fetch(`https://dummyjson.com/users/${id}`, { signal: abortSignal })
      .then((res) => (res.ok ? res.json() : null))
      .then((user: { id: number; firstName: string; lastName: string } | null) =>
        user ? this.toUserOption(user) : null,
      );
  }

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
        if (!query && selectedIds.length > 0) {
          const selectedUsers = await Promise.all(
            selectedIds.map((id) => this.getUserOptionById(id, abortSignal)),
          );

          return selectedUsers.filter((user): user is ComboboxOption<number> => !!user);
        }

        const endpoint = query
          ? `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`
          : 'https://dummyjson.com/users?limit=8';

        const baseUsers = await fetch(endpoint, { signal: abortSignal })
          .then((res) => res.json())
          .then((data: { users: { id: number; firstName: string; lastName: string }[] }) =>
            data.users.map((user) => this.toUserOption(user)),
          );

        const missingSelectedIds = selectedIds.filter(
          (id) => !baseUsers.some((user) => Object.is(user.value, id)),
        );

        if (missingSelectedIds.length === 0) {
          return baseUsers;
        }

        const selectedUsers = await Promise.all(
          missingSelectedIds.map((id) => this.getUserOptionById(id, abortSignal)),
        );

        return [
          ...baseUsers,
          ...selectedUsers.filter((user): user is ComboboxOption<number> => !!user),
        ];
      },
    });

  readonly filterDefinitions: FilterDefinition[] = [
    FilterDef.text('author', 'Author').placeholder('e.g. igor').build(),
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
    FilterDef.number('comments', 'Min comments').placeholder('0').build(),
    FilterDef.email('contact', 'Contact e-mail').build(),
    FilterDef.currency('price', 'Price').build(),
  ];

  handleFiltersChange(filters: FilterValue[]) {
    this.appliedFilters.set(filters);
  }
}
