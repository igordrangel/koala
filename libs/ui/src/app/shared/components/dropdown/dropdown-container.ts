import {
  booleanAttribute,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { KlString, randomString } from '@koalarx/utils/KlString';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown-container.html',
})
export class DropdownContainer implements OnInit, OnDestroy {
  private readonly dropdownTriggerElement =
    viewChild<ElementRef<HTMLButtonElement>>('dropdownTrigger');
  private readonly dropdownContentElement =
    viewChild<ElementRef<HTMLDivElement>>('dropdownContent');
  private readonly closeInsideClick = (event: PointerEvent) => {
    if (this.insideClick()) {
      return;
    }

    const contentElement = this.dropdownContentElement()?.nativeElement;
    const clickElement = event.target as HTMLElement;

    if (contentElement && contentElement.contains(clickElement)) {
      contentElement.hidePopover();
    }
  };

  readonly id = randomString(10, {
    numbers: true,
    uppercase: false,
    lowercase: false,
  });
  readonly insideClick = input(false, { transform: booleanAttribute });
  readonly anchorName = new KlString('--anchor-').concat(this.id);

  constructor() {
    effect(() => {
      const triggerElement = this.dropdownTriggerElement()?.nativeElement;
      const contentElement = this.dropdownContentElement()?.nativeElement;

      if (triggerElement && contentElement) {
        triggerElement.style = `anchor-name: ${this.anchorName};`;
        contentElement.style = `position-anchor: ${this.anchorName};`;
      }
    });
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeInsideClick);
  }

  ngOnInit() {
    document.addEventListener('click', this.closeInsideClick);
  }

  ajustPosition() {
    const triggerElement = this.dropdownTriggerElement()?.nativeElement;
    const contentElement = this.dropdownContentElement()?.nativeElement;

    if (triggerElement && contentElement) {
      setTimeout(() => {
        const position = contentElement.getBoundingClientRect();
        const container = triggerElement.parentElement?.parentElement?.parentElement;
        const triggerPosition = triggerElement.getBoundingClientRect();

        let containerPosition = triggerPosition;

        if (container) {
          containerPosition = container.getBoundingClientRect();
        }

        const triggerPosittionYOnContainer =
          containerPosition.top === triggerPosition.top ? 'top' : 'bottom';
        const triggerPosittionXOnContainer =
          containerPosition.left === triggerPosition.left ? 'left' : 'right';

        const offsetX = position.left - containerPosition.left;
        const offsetY = position.top - containerPosition.top;

        if (offsetX > 0 && triggerPosittionXOnContainer === 'left') {
          contentElement.classList.add('dropdown-right');
          contentElement.style.marginLeft = `5px`;
          contentElement.style.top = `-0.8rem`;
        } else {
          contentElement.classList.add('dropdown-left');
          contentElement.style.marginRight = `5px`;
          contentElement.style.top = `-0.8rem`;
        }

        if (offsetY > 0 && triggerPosittionYOnContainer === 'top') {
          contentElement.classList.add('dropdown-top');
          contentElement.classList.add('dropdown-start');
          contentElement.classList.remove('dropdown-end');
        } else {
          contentElement.classList.add('dropdown-top');
          contentElement.classList.add('dropdown-end');
          contentElement.classList.remove('dropdown-start');
        }
      });
    }
  }
}
