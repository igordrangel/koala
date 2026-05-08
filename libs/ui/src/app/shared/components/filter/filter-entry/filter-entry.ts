import { Component, DestroyRef, ElementRef, Injector, inject, input, output } from '@angular/core';
import { effect } from '@angular/core';
import { ComboboxOption } from '../../combobox/combobox';
import {
  DEFAULT_FILTER_I18N,
  FilterDefinition,
  FilterEntry,
  FilterI18n,
  FilterSize,
  FilterVariant,
} from '../filter.models';
import { FilterEntryEditComponent } from './edit/edit';
import { FilterEntryState } from './filter-entry.state';
import { FilterEntryViewComponent } from './view/view';

@Component({
  selector: 'app-filter-entry',
  templateUrl: './filter-entry.html',
  imports: [FilterEntryEditComponent, FilterEntryViewComponent],
  host: {
    class: 'relative inline-flex',
    '(click)': '$event.stopPropagation()',
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
})
export class FilterEntryComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private lastEmittedEditState: { entryId: string; isEditing: boolean } | null = null;

  readonly entry = input.required<FilterEntry>();
  readonly definition = input.required<FilterDefinition>();
  readonly options = input<ComboboxOption[]>([]);
  readonly size = input<FilterSize>('sm');
  readonly variant = input<FilterVariant>('default');
  readonly autoOpen = input(false);
  readonly i18n = input<FilterI18n>(DEFAULT_FILTER_I18N);

  readonly valueChange = output<{ entryId: string; value: unknown }>();
  readonly remove = output<string>();
  readonly tabFromField = output<void>();
  readonly editModeChange = output<{ entryId: string; isEditing: boolean }>();

  readonly state = new FilterEntryState({
    destroyRef: this.destroyRef,
    injector: inject(Injector),
    elementRef: this.elementRef,
    entry: () => this.entry(),
    definition: () => this.definition(),
    options: () => this.options(),
    size: () => this.size(),
    variant: () => this.variant(),
    autoOpen: () => this.autoOpen(),
    i18n: () => this.i18n(),
    emitValue: (value) => this.valueChange.emit({ entryId: this.entry().id, value }),
    emitRemove: (id) => this.remove.emit(id),
    emitTab: () => this.tabFromField.emit(),
  });

  constructor() {
    effect(() => {
      const nextState = {
        entryId: this.entry().id,
        isEditing: this.state.isEditing(),
      };

      if (
        this.lastEmittedEditState?.entryId === nextState.entryId &&
        this.lastEmittedEditState.isEditing === nextState.isEditing
      ) {
        return;
      }

      this.lastEmittedEditState = nextState;
      this.editModeChange.emit(nextState);
    });
  }

  onDocumentPointerDown(event: PointerEvent) {
    this.state.onDocumentPointerDown(event);
  }
}
