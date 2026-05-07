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

  private readonly mockUsers: ComboboxOption<string>[] = [
    { value: 'u-1', label: 'Igor Silva' },
    { value: 'u-2', label: 'Amanda Costa' },
    { value: 'u-3', label: 'Rafael Rocha' },
    { value: 'u-4', label: 'Bianca Souza' },
  ];

  private readonly usersResourceFactory = (values: Signal<unknown[]>) =>
    resource({
      params: () => values(),
      loader: async ({ params }) => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const valueSet = new Set(params.map((value) => `${value}`));

        return valueSet.size
          ? this.mockUsers.filter((user) => valueSet.has(user.value))
          : this.mockUsers;
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
