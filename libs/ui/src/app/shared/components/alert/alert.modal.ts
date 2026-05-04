import { Component, inject } from '@angular/core';
import { ModalContainer } from '../modal/modal-container';
import { Button } from '../button/button';
import { ModalRef } from '../modal/modal-ref';
import { MODAL_DATA } from '../modal/modal';
import { AlertData } from './alert';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert.modal.html',
  imports: [ModalContainer, Button],
})
export class AlertModal {
  readonly modalRef = inject(ModalRef);
  readonly data = inject<AlertData>(MODAL_DATA);
}
