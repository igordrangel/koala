```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Combobox, ComboboxOption } from '@/shared/components/combobox/combobox';

@Component({
  selector: 'app-combobox-local-sample',
  templateUrl: './combobox-local-sample.html',
  imports: [ReactiveFormsModule, Combobox],
})
export class ComboboxLocalSample {
  readonly localComboboxControl = new FormControl<string | null>(null);

  readonly localOptions: ComboboxOption<string>[] = [
    { value: 'sp', label: 'Sao Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais' },
    { value: 'ba', label: 'Bahia' },
    { value: 'pr', label: 'Parana' },
    { value: 'sc', label: 'Santa Catarina' },
    { value: 'rs', label: 'Rio Grande do Sul' },
    { value: 'pe', label: 'Pernambuco' },
  ];
}
```
