# Side Window

## Installation

```bash
kl install -n side-window
```

### Close Corner

```html
<app-side-window>
  <div class="flex justify-between items-center" title>
    <span>Hello!</span>
    <button appButton circle variant="ghost" size="sm" (click)="sideWindowRef.dismiss()">X</button>
  </div>
  <ng-container content> Press ESC key or click the button below to close </ng-container>
</app-side-window>
```

```typescript
import { Component, inject } from '@angular/core';
import { Button } from '@/shared/components/button/button';
import { SideWindowContainer } from '@/shared/components/side-window/side-window-container';
import { SideWindowRef } from '@/shared/components/side-window/side-window-ref';

@Component({
  selector: 'app-side-window-close-corner-sample',
  templateUrl: './side-window-close-corner-sample.html',
  imports: [SideWindowContainer, Button],
})
export class SideWindowCloseCornerSample {
  readonly sideWindowRef = inject(SideWindowRef);
}
```

### Sample

```html
<app-side-window>
  <ng-container title>Hello!</ng-container>
  <ng-container content> Press ESC key or click the button below to close </ng-container>
  <ng-container actions>
    <button appButton (click)="sideWindowRef.dismiss()">Close</button>
  </ng-container>
</app-side-window>
```

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

### Trigger

```html
<button appButton (click)="open()">open side window</button>
```

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

### Trigger Close Corner

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
