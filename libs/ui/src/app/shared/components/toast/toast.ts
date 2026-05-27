import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  InjectionToken,
  Injector,
} from '@angular/core';
import { randomString } from '@koalarx/utils/KlString';
import { TOAST_REF_TOKEN, ToastAlert, ToastRef } from '.';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';
export const TOAST_CONFIG = new InjectionToken('ToastConfig');
export const TOAST_APP_REF = new InjectionToken('ToastAppRef');

export interface ToastConfig {
  type: ToastType;
  message: string;
  title?: string;
  timeout?: number;
}

export interface ToastOptions {
  title?: string;
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class Toast {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  private updateStackPositions() {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    const total = children.length;

    children.forEach((child, index) => {
      const positionFromBottom = total - 1 - index;

      if (positionFromBottom === 0) {
        child.style.zIndex = '10000';
        child.style.opacity = '1';
      } else {
        const position = positionFromBottom > 2 ? 2 : positionFromBottom;
        const scale = 1 - position * 0.04;

        const nextVisualChild = children[position - 1] as HTMLElement;
        const baseHeight = nextVisualChild ? nextVisualChild.offsetHeight : 64;

        const translateY = position * baseHeight - 4;

        const zIndex = 10000 - positionFromBottom;

        const opacity = positionFromBottom > 2 ? '0' : '1';
        const currentTransform = child.style.transform;
        const newTransform = `scale(${scale}) translateY(${translateY}px)`;

        child.style.zIndex = `${zIndex}`;

        setTimeout(() => {
          if (positionFromBottom > 2) {
            child.style.opacity = opacity;
          }

          if (positionFromBottom <= 2) {
            const animation = document.createElement('style');
            const currentScale = currentTransform.split(' ')[0];

            animation.innerHTML = `
              @keyframes sooner-reposition-${index} {
                from {
                  transform: scale(${scale}) translateY(${translateY}px);
                }
                to {
                  transform: ${currentScale} translateY(${translateY}px);
                }
              }
            `;

            document.head.appendChild(animation);

            child.style.transition = 'none';
            //child.style.animation = `sooner-reposition-${index} 0.2s ease-in-out`;

            setTimeout(() => {
              child.style.transform = newTransform;
              child.style.opacity = opacity;
              child.style.animation = '';
              child.style.transition = 'transform 0.2s ease-in-out';
              document.head.removeChild(animation);
            }, 200);
          }
        });
      }
    });
  }

  private refreshStack() {
    setTimeout(() => this.updateStackPositions(), 50);
  }

  private generateElementId() {
    let elementId: string;

    do {
      elementId = randomString(50, {
        numbers: false,
        lowercase: true,
        uppercase: true,
        specialCharacters: false,
      });
    } while (document.getElementById(elementId));

    return elementId;
  }

  private open(config?: ToastConfig) {
    const body = document.body;

    if (body) {
      let toastContainer = document.querySelector('.toast-container') as HTMLElement;

      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.classList.add(
          'toast-container',
          'toast',
          'toast-end',
          'toast-bottom',
          'z-[10000]',
          'group',
        );

        body.appendChild(toastContainer);
      }

      const elementId = this.generateElementId();
      const container = document.createElement('div');

      container.id = elementId;
      container.classList.add(
        'w-full',
        'pointer-events-auto',
        'transition-transform',
        'duration-200',
        'origin-bottom',
        'group-hover:transform-[scale(1)_translateY(0px)]!',
        'group-hover:opacity-100!',
      );
      container.style.transform = 'scale(1) translateY(0px)';

      toastContainer.appendChild(container);

      const componentRef = createComponent(ToastAlert, {
        environmentInjector: this.injector,
        hostElement: container,
        elementInjector: Injector.create({
          providers: [
            { provide: TOAST_CONFIG, useValue: config },
            { provide: TOAST_APP_REF, useValue: this.appRef },
            {
              provide: TOAST_REF_TOKEN,
              useValue: () => componentRef,
            },
            {
              provide: ToastRef,
              deps: [TOAST_CONFIG, TOAST_APP_REF, TOAST_REF_TOKEN],
            },
          ],
        }),
      });

      this.appRef.attachView(componentRef.hostView);
      componentRef.changeDetectorRef.detectChanges();

      this.updateStackPositions();

      componentRef.onDestroy(() => this.refreshStack());
    }
  }

  success(message: string, options?: ToastOptions) {
    this.open({
      type: 'success',
      title: options?.title,
      message,
      timeout: options?.timeout,
    });
  }

  error(message: string, options?: ToastOptions) {
    this.open({
      type: 'error',
      title: options?.title,
      message,
      timeout: options?.timeout,
    });
  }

  info(message: string, options?: ToastOptions) {
    this.open({
      type: 'info',
      title: options?.title,
      message,
      timeout: options?.timeout,
    });
  }

  warning(message: string, options?: ToastOptions) {
    this.open({
      type: 'warning',
      title: options?.title,
      message,
      timeout: options?.timeout,
    });
  }

  default(message: string, options?: ToastOptions) {
    this.open({
      type: 'default',
      title: options?.title,
      message,
      timeout: options?.timeout,
    });
  }
}
