```typescript
import { Component, inject } from '@angular/core';
import { Button } from '@/shared/components/button/button';
import { SideWindow } from '@/shared/components/side-window/side-window';
import { SideWindowSample } from './modal-dialog-sample';

@Component({
  selector: 'app-side-window-trigger-sample',
  templateUrl: './modal-trigger.sample.html',
  imports: [Button],
})
export class SideWindowTriggerSample {
  private readonly modal = inject(Modal);

  openModal() {
    this.modal.open(SideWindowSample, {
      closeOptions: {
        pressEscape: true,
        clickOutside: false,
      },
    });
  }
}
```
