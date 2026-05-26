import { isMobile } from '@/shared/utils/is-mobile';
import {
  booleanAttribute,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { randomString } from '@koalarx/utils/KlString';

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
  private readonly dropdownToggle = (event: ToggleEvent) => {
    this.isOpen.emit(event.newState === 'open');

    if (event.newState === 'closed') {
      this.closed.emit();
    } else if (event.newState === 'open') {
      this.opened.emit();
    }
  };

  readonly id = randomString(10, {
    numbers: true,
    uppercase: false,
    lowercase: false,
  });
  readonly insideClick = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly isOpen = output<boolean>();

  private isOverlapTrigger(triggerElement: HTMLElement, contentElement: HTMLElement) {
    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();

    return !(
      contentRect.bottom < triggerRect.top ||
      contentRect.top > triggerRect.bottom ||
      contentRect.right < triggerRect.left ||
      contentRect.left > triggerRect.right
    );
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeInsideClick);
    this.dropdownContentElement()?.nativeElement.removeEventListener('toggle', this.dropdownToggle);
  }

  ngOnInit() {
    document.addEventListener('click', this.closeInsideClick);
    this.dropdownContentElement()?.nativeElement.addEventListener('toggle', this.dropdownToggle);
  }

  ajustPosition() {
    const triggerElement = this.dropdownTriggerElement()?.nativeElement;
    const contentElement = this.dropdownContentElement()?.nativeElement;

    if (triggerElement && contentElement) {
      contentElement.classList.add('dropdown-start');

      setTimeout(() => {
        let isAboveTrigger = false;
        let tryCount = 0;

        do {
          isAboveTrigger = this.isOverlapTrigger(triggerElement, contentElement);

          if (isAboveTrigger) {
            if (contentElement.classList.contains('dropdown-top')) {
              contentElement.classList.remove('dropdown-top');
              contentElement.classList.add('dropdown-bottom');
            } else if (contentElement.classList.contains('dropdown-bottom')) {
              contentElement.classList.remove('dropdown-bottom');
              contentElement.classList.add('dropdown-left');
            } else {
              contentElement.classList.add('dropdown-top');
            }
          }

          tryCount++;
        } while (isAboveTrigger && tryCount < 3);

        if (!isMobile()) {
          contentElement.style.marginRight = '1.5rem';
        } else {
          contentElement.style.marginRight = '1rem';
        }
      });
    }
  }
}
