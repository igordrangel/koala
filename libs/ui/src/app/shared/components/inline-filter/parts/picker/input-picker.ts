import { Combobox, ComboboxInput } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from '../../../dropdown';
import { InlineFilterField } from '../../config';
import { optionsToQueryParams } from '../../utils/options-to-query-params';
import { queryParamsToOptions } from '../../utils/query-params-to-options';
import { InputFilterChip } from '../chip/input-filter-chip';
import { InputFilterEdit } from '../edit/input-filter-edit';
import { handleAccessibility } from './accessibility/handle-accessibility';

@Component({
  selector: 'app-input-picker',
  templateUrl: './input-picker.html',
  imports: [
    FormsModule,
    Dropdown,
    Listbox,
    Option,
    Combobox,
    ComboboxInput,
    InputFilterEdit,
    InputFilterChip,
  ],
})
export class InputPicker implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly injector = inject(Injector);

  private readonly queryParams = toSignal(this.activatedRoute.queryParams);

  private readonly inputFilterElement = viewChild<ElementRef<HTMLInputElement>>('inputFilter');
  private readonly triggerOptionsElement =
    viewChild<ElementRef<HTMLButtonElement>>('triggerOptions');
  private readonly filterOptionsElement = viewChild<ElementRef<HTMLDivElement>>('filterOptions');

  readonly inlineFilterElementId = `inline-filter-${Math.random().toString(16).slice(2)}`;

  readonly filterOptions = input.required<InlineFilterField[]>();
  readonly placeholder = input('Type to filter');
  readonly filter = model('');

  readonly filteredOptions = computed(() => {
    const filterOptions = this.filterOptions().filter(
      (option) => !this.selectedOptions().some((selected) => selected.name === option.name),
    );
    const filterValue = this.filter().toLowerCase();

    if (!filterValue) {
      return filterOptions;
    }

    return filterOptions.filter((option) => option.label.toLowerCase().includes(filterValue));
  });

  readonly selectedOptions = signal<InlineFilterField[]>([]);

  constructor() {
    handleAccessibility(this.selectedOptions, this.filter, this.destroyRef);

    effect(() => {
      const triggerElement = this.triggerOptionsElement()?.nativeElement;
      const filterOptionsElement = this.filterOptionsElement()?.nativeElement?.parentElement;
      const isVisible = filterOptionsElement?.matches(':popover-open') ?? false;
      const filteredOptions = this.filteredOptions();
      const hasFilter = !!this.filter();

      if (!triggerElement) {
        return;
      }

      if (isVisible && filteredOptions.length === 0) {
        filterOptionsElement?.hidePopover();
        return;
      }

      if (!isVisible && hasFilter && filteredOptions.length > 0) {
        triggerElement.click();
      }
    });

    effect(() => {
      const selectedOptions = this.selectedOptions();
      const payload = optionsToQueryParams(selectedOptions);

      this.router.navigate([], { queryParams: payload });

      if (!selectedOptions.some((option) => option.editing)) {
        this.inputFilterElement()?.nativeElement.focus();
      }
    });
  }

  ngOnInit() {
    const queryParams = this.queryParams();

    if (queryParams) {
      queryParamsToOptions(this.filterOptions(), this.selectedOptions, queryParams, this.injector);
    }
  }

  chooseOption(values: InlineFilterField[]) {
    const option = values[0];

    option.editing = true;

    this.selectedOptions.update((options) => {
      if (options.includes(option)) {
        return options.filter((o) => o !== option);
      }

      return [...options, option];
    });

    this.filter.set('');
  }

  edit(field: InlineFilterField) {
    this.selectedOptions.update((options) => {
      if (options.includes(field)) {
        return options.map((o) => {
          if (o === field) {
            return { ...o, editing: true };
          }

          return { ...o, editing: false };
        });
      }

      return options;
    });
  }

  exitEditMode(field: InlineFilterField) {
    this.selectedOptions.update((options) =>
      options.map((o) => {
        if (o === field) {
          return { ...o, editing: false };
        }

        return o;
      }),
    );
  }

  removeOption(option: InlineFilterField) {
    this.selectedOptions.update((options) => options.filter((o) => o !== option));
  }
}
