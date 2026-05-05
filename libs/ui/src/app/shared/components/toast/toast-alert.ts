import { Component, inject, OnInit, signal } from '@angular/core';
import { TOAST_CONFIG, ToastConfig } from './toast';
import { ToastRef } from './toast-ref';
import { Button } from '../button/button';

@Component({
  selector: 'app-toast-alert',
  templateUrl: './toast-alert.html',
  imports: [Button],
})
export class ToastAlert implements OnInit {
  readonly toastRef = inject(ToastRef);
  readonly config = inject<ToastConfig>(TOAST_CONFIG);
  readonly timeout = this.config.timeout || 5000;

  readonly currentTimeout = signal(0);

  private startTimeout() {
    this.currentTimeout.set(this.timeout);

    const interval = setInterval(() => {
      const current = this.currentTimeout();
      if (current > 0) {
        this.currentTimeout.set(current - 10);
      } else {
        clearInterval(interval);
        this.toastRef.dismiss();
      }
    }, 10);
  }

  ngOnInit() {
    if (this.timeout > 0) {
      this.startTimeout();
    }
  }
}
