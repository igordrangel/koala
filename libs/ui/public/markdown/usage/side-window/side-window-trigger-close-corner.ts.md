```typescript
import { Component, inject } from '@angular/core';
import { Button } from '@/shared/components/button/button';
import { SideWindow } from '@/shared/components/side-window/side-window';
import { SideWindowCloseCornerSample } from './modal-dialog-close-corner-sample';

@Component({
  selector: 'app-side-window-trigger-close-corner-sample',
  templateUrl: './side-window-trigger-close-corner.sample.html',
  imports: [Button],
})
export class SideWindowTriggerCloseCornerSample {
  private readonly modal = inject(SideWindow);

  openModal() {
    this.modal.open(SideWindowCloseCornerSample, {
      closeOptions: {
        pressEscape: true,
        clickOutside: false,
      },
    });
  }
}
```
