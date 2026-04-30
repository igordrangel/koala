import { Component, inject } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { MODAL_CONFIG, MODAL_DATA, ModalConfig } from '../../../shared/components/modal/modal';
import { ModalContainer } from '../../../shared/components/modal/modal-container';
import { ModalRef } from '../../../shared/components/modal/modal-ref';

@Component({
  selector: 'app-modal-sample',
  templateUrl: './modal-sample.html',
  imports: [ModalContainer, Button],
})
export class ModalSample {
  private readonly data = inject<any>(MODAL_DATA);

  readonly modalRef = inject(ModalRef);
  readonly modalOptions = inject<ModalConfig>(MODAL_CONFIG);
  readonly closeButtonCorner = this.data?.closeButtonCorner || false;
  readonly customWidth = this.modalOptions?.data?.customWidth || 'w-100';
}
