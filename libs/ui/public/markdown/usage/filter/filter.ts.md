```typescript
import { JsonPipe } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComboboxOption } from '@/shared/components/combobox/combobox';
import {
  Filter,
  FilterDef,
  FilterDefinition,
  FilterValue,
} from '@/shared/components/filter/filter';

@Component({
  selector: 'app-filter-sample',
  templateUrl: './filter-sample.html',
  imports: [ReactiveFormsModule, JsonPipe, Filter],
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
    { value: 'design-system', label: 'Design System' },
  ];

  readonly filterDefinitions: FilterDefinition[] = [
    FilterDef.text('author', 'Author').placeholder('e.g. john').build(),
    FilterDef.cpf('cpf', 'CPF').build(),
    FilterDef.cnpj('cnpj', 'CNPJ').build(),
    FilterDef.select('status', 'Status').options(this.statusOptions).build(),
    FilterDef.selectMultiple('labels', 'Labels').options(this.labelOptions).build(),
    FilterDef.date('created', 'Created after').build(),
    FilterDef.number('min-comments', 'Min comments').placeholder('0').build(),
  ];

  handleFiltersChange(filters: FilterValue[]) {
    this.appliedFilters.set(filters);
    console.log('Applied filters:', filters);
  }
}
```
