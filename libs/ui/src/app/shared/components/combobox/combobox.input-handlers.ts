import { ComboboxOption } from './combobox';
import {
  removeSelectedOption,
  selectedOptionsToValues,
  toggleSelectedOption,
  hasLabelInSelectedOptions,
} from './helpers';

type Getter<T> = () => T;

export class ComboboxInputHandlers {
  constructor(
    private config: {
      multiple: Getter<boolean>;
      selectedOptions: Getter<ComboboxOption[]>;
      selectedOption: Getter<ComboboxOption | null>;
      resolvedOptions: Getter<ComboboxOption[]>;
      inputValue: Getter<string>;
      isOpen: Getter<boolean>;
      internalValue: Getter<unknown>;
      suppressNextInputEvent: boolean;
      skipNextFilterSync: boolean;
      setInputValue: (value: string, resetFilter?: boolean) => void;
      setSelectedOptions: (options: ComboboxOption[]) => void;
      setSelectedOption: (option: ComboboxOption | null) => void;
      setInternalValue: (value: unknown) => void;
      setIsOpen: (value: boolean) => void;
      setSuppressionFlag: (value: boolean) => void;
      setSkipNextFilterSyncFlag: (value: boolean) => void;
      onChange: (value: unknown) => void;
      clearMultipleInput: () => void;
      updateActiveIndexFromOptions: () => void;
    },
  ) {}

  handleInputEvent(value: string) {
    if (this.config.multiple() && this.config.suppressNextInputEvent) {
      this.config.setSuppressionFlag(false);
      this.config.clearMultipleInput();
      return;
    }

    if (this.config.multiple() && hasLabelInSelectedOptions(this.config.selectedOptions(), value)) {
      this.config.clearMultipleInput();
      return;
    }

    this.config.setSkipNextFilterSyncFlag(false);

    if (!this.config.multiple() && value.trim() === '' && this.config.selectedOption() !== null) {
      this.config.setSelectedOption(null);
      this.config.setInternalValue(null);
      this.config.onChange(null);
    }

    this.config.setInputValue(value);

    if (!this.config.isOpen()) {
      this.config.setIsOpen(true);
    }

    queueMicrotask(() => this.config.updateActiveIndexFromOptions());
  }

  syncMultipleSelection(option: ComboboxOption) {
    const next = toggleSelectedOption(this.config.selectedOptions(), option);
    const nextValues = selectedOptionsToValues(next);

    this.config.setSelectedOptions(next);
    this.config.setInternalValue(nextValues);
    this.config.onChange(nextValues);
    this.config.setSuppressionFlag(true);
    this.config.clearMultipleInput();
  }

  syncSingleSelection(option: ComboboxOption) {
    this.config.setSelectedOption(option);
    this.config.setInternalValue(option.value);
    this.config.onChange(option.value);
    this.config.setInputValue(option.label, true);
  }

  clearSelection() {
    if (this.config.multiple()) {
      this.config.setSelectedOptions([]);
      this.config.setInternalValue([]);
      this.config.onChange([]);
      this.config.clearMultipleInput();
      return;
    }

    this.config.setSelectedOption(null);
    this.config.setInternalValue(null);
    this.config.onChange(null);
    this.config.setInputValue('');
  }

  removeOption(optionValue: unknown) {
    if (!this.config.multiple()) {
      return;
    }

    const next = removeSelectedOption(this.config.selectedOptions(), optionValue);
    const nextValues = selectedOptionsToValues(next);

    this.config.setSelectedOptions(next);
    this.config.setInternalValue(nextValues);
    this.config.onChange(nextValues);
  }
}
