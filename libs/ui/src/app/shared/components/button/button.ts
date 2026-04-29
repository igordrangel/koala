import { booleanAttribute, Directive, effect, ElementRef, inject, input } from '@angular/core';

export type ButtonVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'ghost';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({ selector: 'button[appButton], a[appButton]' })
export class Button {
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(
    ElementRef<HTMLButtonElement>,
  );
  private readonly initialClasses = this.elementRef.nativeElement.className;

  readonly variant = input<ButtonVariant>('neutral');
  readonly size = input<ButtonSize>('md');
  readonly circle = input(false, { transform: booleanAttribute });
  readonly outline = input(false, { transform: booleanAttribute });
  readonly soft = input(false, { transform: booleanAttribute });
  readonly dash = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  private get variantClass() {
    switch (this.variant()) {
      case 'neutral':
        return 'btn-neutral';
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'btn-accent';
      case 'info':
        return 'btn-info';
      case 'success':
        return 'btn-success';
      case 'warning':
        return 'btn-warning';
      case 'error':
        return 'btn-error';
      case 'ghost':
        return 'btn-ghost';
    }
  }

  private get sizeClass() {
    switch (this.size()) {
      case 'xs':
        return 'btn-xs';
      case 'sm':
        return 'btn-sm';
      case 'md':
        return 'btn-md';
      case 'lg':
        return 'btn-lg';
      case 'xl':
        return 'btn-xl';
    }
  }

  constructor() {
    effect(() => {
      const button = this.elementRef.nativeElement;

      for (const key of button.classList) {
        if (!this.initialClasses.split(' ').includes(key)) {
          button.classList.remove(key);
        }
      }

      button.classList.add('btn', this.variantClass, this.sizeClass);

      if (this.circle()) {
        button.classList.add('btn-circle');
      }
      if (this.outline()) {
        button.classList.add('btn-outline');
      }
      if (this.soft()) {
        button.classList.add('btn-soft');
      }
      if (this.dash()) {
        button.classList.add('btn-dash');
      }
    });

    effect(() => {
      const button = this.elementRef.nativeElement;
      button.disabled = this.disabled();
    });
  }
}
