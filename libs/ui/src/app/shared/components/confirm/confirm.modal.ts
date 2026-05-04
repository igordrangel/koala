import { Component, inject } from '@angular/core';
import { ModalContainer } from '../modal/modal-container';
import { Button } from '../button/button';
import { ModalRef } from '../modal/modal-ref';
import { MODAL_DATA } from '../modal/modal';
import { ConfirmData } from './confirm';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm.modal.html',
  imports: [ModalContainer, Button],
})
export class ConfirmModal {
  readonly modalRef = inject(ModalRef);
  readonly data = inject<ConfirmData>(MODAL_DATA);
}
