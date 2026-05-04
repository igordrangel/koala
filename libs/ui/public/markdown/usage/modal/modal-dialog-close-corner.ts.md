```typescript
import { Component, inject } from '@angular/core';
import { Button } from '@/shared/components/button/button';
import { ModalContainer } from '@/shared/components/modal/modal-container';
import { ModalRef } from '@/shared/components/modal/modal-ref';

@Component({
  selector: 'app-modal-dialog-close-corner-sample',
  templateUrl: './modal-dialog-close-corner-sample.html',
  imports: [ModalContainer, Button],
})
export class ModalDialogCloseCornerSample {
  readonly modalRef = inject(ModalRef);
}
```
