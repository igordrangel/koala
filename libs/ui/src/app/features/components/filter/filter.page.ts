import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, resource, signal, Signal } from '@angular/core';
import { Section } from '../../../core/components/section';
import { ComboboxOption } from '../../../shared/components/combobox/combobox';
import {
  Filter,
  FilterDef,
  FilterDefinition,
  FilterValue,
} from '../../../shared/components/filter/filter';

@Component({
  selector: 'app-filter-page',
  templateUrl: './filter.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, Section, Filter],
})
export class FilterPage {
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
        await new Promise((r) => setTimeout(r, 200));
        const valueSet = new Set(params.map((v) => `${v}`));
        return valueSet.size ? this.mockUsers.filter((u) => valueSet.has(u.value)) : this.mockUsers;
      },
    });

  readonly filterDefinitions: FilterDefinition[] = [
    FilterDef.text('author', 'Author').placeholder('e.g. igor').build(),
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
  ];

  handleFiltersChange(filters: FilterValue[]) {
    this.appliedFilters.set(filters);
  }
}
