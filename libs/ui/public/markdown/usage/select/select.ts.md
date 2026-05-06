```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from '@/shared/components/select/select';

@Component({
  selector: 'app-select-sample',
  templateUrl: './select-sample.html',
  imports: [ReactiveFormsModule, Select],
})
export class SelectSample {
  selectControl = new FormControl<string>('');
}
```
