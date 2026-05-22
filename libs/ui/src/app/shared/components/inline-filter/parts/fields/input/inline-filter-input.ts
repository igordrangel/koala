import { Component, ElementRef, OnInit, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldBase } from '../field.base';

@Component({
  selector: 'app-inline-filter-input',
  templateUrl: './inline-filter-input.html',
  imports: [FormsModule],
})
export class InlineFilterInput extends FieldBase implements OnInit {
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputField');

  readonly isInvalid = output<boolean>();

  ngOnInit(): void {
    setTimeout(() => {
      this.inputElement()?.nativeElement.focus();
    });
  }
}
