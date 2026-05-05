```typescript
import { Component, inject } from '@angular/core';
import { Button } from '@/shared/components/button/button';
import { SideWindowContainer } from '@/shared/components/side-window/side-window-container';
import { SideWindowRef } from '@/shared/components/side-window/side-window-ref';

@Component({
  selector: 'app-side-window-sample',
  templateUrl: './side-window-sample.html',
  imports: [SideWindowContainer, Button],
})
export class SideWindowSample {
  readonly sideWindowRef = inject(SideWindowRef);
}
```
