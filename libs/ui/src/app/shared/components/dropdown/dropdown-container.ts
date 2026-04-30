import {
  booleanAttribute,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown-container.html',
})
export class DropdownContainer implements OnDestroy {
  private readonly dropdown = viewChild<ElementRef<HTMLDivElement>>('dropdown');
  private readonly handleClick = (dropdownElement: HTMLDivElement) => () => {
    if (this.closeOnClick()) {
      dropdownElement.classList.toggle('dropdown-close');
    } else {
      dropdownElement.classList.remove('dropdown-close');
    }
  };

  readonly closeOnClick = input(false, { transform: booleanAttribute });

  ngOnDestroy(): void {
    const dropdown = this.dropdown();

    if (dropdown) {
      dropdown.nativeElement.removeEventListener('click', this.handleClick(dropdown.nativeElement));
    }
  }

  constructor() {
    effect(() => {
      const dropdown = this.dropdown();

      if (dropdown) {
        dropdown.nativeElement.addEventListener('click', this.handleClick(dropdown.nativeElement));
      }
    });
  }
}
