```typescript
import { Component, inject } from '@angular/core';
import { Button } from '@/shared/components/button/button';
import { ModalContainer } from '@/shared/components/modal/modal-container';
import { ModalRef } from '@/shared/components/modal/modal-ref';

@Component({
  selector: 'app-modal-dialog-sample',
  templateUrl: './modal-dialog-sample.html',
  imports: [ModalContainer, Button],
})
export class ModalDialogSample {
  readonly modalRef = inject(ModalRef);
}
```
