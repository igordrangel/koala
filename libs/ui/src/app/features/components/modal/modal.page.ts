import { Component, inject } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { Modal, ModalConfig } from '../../../shared/components/modal/modal';
import { ModalSample } from './modal-sample';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal.page.html',
  imports: [Button],
})
export class ModalPage {
  private readonly modal = inject(Modal);

  openModal(
    closeOptions: ModalConfig['closeOptions'],
    closeButtonCorner = false,
    customWidth?: string,
  ) {
    this.modal.open(ModalSample, { closeOptions, data: { closeButtonCorner, customWidth } });
  }
}
