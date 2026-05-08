import {
  booleanAttribute,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown-container.html',
})
export class DropdownContainer implements OnDestroy {
  private readonly dropdown = viewChild<ElementRef<HTMLDivElement>>('dropdown');
  private readonly trigger = viewChild<ElementRef<HTMLDivElement>>('trigger');
  private readonly options = viewChild<ElementRef<HTMLUListElement>>('options');
  private readonly viewportPadding = 8;
  private readonly fallbackPanelHeight = 320;
  private readonly fallbackPanelWidth = 280;
  private readonly reposition = () => this.applyAutoPosition();
  private readonly positionCleanup: Array<() => void> = [];
  private clickListener: (() => void) | null = null;

  readonly resolvedDirection = signal<'top' | 'bottom'>('bottom');
  readonly alignEnd = signal(false);
  readonly panelMaxWidth = signal<number | null>(null);

  private readonly handleClick = (dropdownElement: HTMLDivElement) => () => {
    if (this.closeOnClick()) {
      dropdownElement.classList.toggle('dropdown-close');
    } else {
      dropdownElement.classList.remove('dropdown-close');
    }

    const isOpen = !dropdownElement.classList.contains('dropdown-close');

    if (isOpen) {
      this.applyAutoPosition();
      this.bindPositionListeners();
      return;
    }

    this.unbindPositionListeners();
  };

  readonly closeOnClick = input(false, { transform: booleanAttribute });

  private applyAutoPosition() {
    const trigger = this.trigger()?.nativeElement;
    const options = this.options()?.nativeElement;

    if (!trigger || !options) {
      this.resolvedDirection.set('bottom');
      this.alignEnd.set(false);
      this.panelMaxWidth.set(null);
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const optionsRect = options.getBoundingClientRect();
    const panelHeight = optionsRect.height || this.fallbackPanelHeight;
    const panelWidth = optionsRect.width || this.fallbackPanelWidth;
    const viewportMaxWidth = Math.max(160, window.innerWidth - this.viewportPadding * 2);

    const spaceAbove = triggerRect.top - this.viewportPadding;
    const spaceBelow = window.innerHeight - triggerRect.bottom - this.viewportPadding;
    const openOnTop = spaceBelow < panelHeight && spaceAbove > spaceBelow;

    this.resolvedDirection.set(openOnTop ? 'top' : 'bottom');

    const overflowsRight = triggerRect.left + panelWidth > window.innerWidth - this.viewportPadding;
    const canAlignEnd = triggerRect.right - panelWidth >= this.viewportPadding;

    if (overflowsRight && canAlignEnd) {
      this.alignEnd.set(true);
      this.panelMaxWidth.set(
        Math.max(160, Math.min(viewportMaxWidth, triggerRect.right - this.viewportPadding)),
      );
      return;
    }

    this.alignEnd.set(false);
    this.panelMaxWidth.set(
      Math.max(
        160,
        Math.min(viewportMaxWidth, window.innerWidth - triggerRect.left - this.viewportPadding),
      ),
    );
  }

  private bindPositionListeners() {
    if (this.positionCleanup.length) {
      return;
    }

    window.addEventListener('scroll', this.reposition, { passive: true, capture: true });
    window.addEventListener('resize', this.reposition, { passive: true });

    this.positionCleanup.push(() =>
      window.removeEventListener('scroll', this.reposition, { capture: true }),
    );
    this.positionCleanup.push(() => window.removeEventListener('resize', this.reposition));
  }

  private unbindPositionListeners() {
    this.positionCleanup.splice(0).forEach((cleanup) => cleanup());
  }

  ngOnDestroy(): void {
    const dropdown = this.dropdown();

    if (dropdown && this.clickListener) {
      dropdown.nativeElement.removeEventListener('click', this.clickListener);
    }

    this.unbindPositionListeners();
  }

  constructor() {
    effect(() => {
      const dropdown = this.dropdown();
      const dropdownElement = dropdown?.nativeElement;

      if (!dropdownElement) {
        return;
      }

      if (this.clickListener) {
        dropdownElement.removeEventListener('click', this.clickListener);
      }

      this.clickListener = this.handleClick(dropdownElement);
      dropdownElement.addEventListener('click', this.clickListener);
    });

    queueMicrotask(() => this.applyAutoPosition());
  }
}
