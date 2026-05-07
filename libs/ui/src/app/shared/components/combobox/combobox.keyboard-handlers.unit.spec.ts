import { describe, expect, it, vi } from 'vitest';
import type { ComboboxOption } from './combobox';
import { setupComboboxKeyboardHandling } from './combobox.keyboard-handlers';

function createKeyboardEvent(key: string): KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as KeyboardEvent;
}

describe('combobox.keyboard-handlers', () => {
  const options: ComboboxOption[] = [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
  ];

  it('should open and navigate with ArrowDown', () => {
    let isOpen = false;
    let activeIndex = -1;

    const handler = setupComboboxKeyboardHandling({
      isOpen: () => isOpen,
      activeIndex: () => activeIndex,
      resolvedOptions: () => options,
      setIsOpen: (value) => {
        isOpen = value;
      },
      setActiveIndex: (value) => {
        activeIndex = value;
      },
      selectOption: vi.fn(),
      close: vi.fn(),
    });

    handler(createKeyboardEvent('ArrowDown'));

    expect(isOpen).toBe(true);
    expect(activeIndex).toBe(0);
  });

  it('should select active option on Enter when open', () => {
    const selectOption = vi.fn();

    const handler = setupComboboxKeyboardHandling({
      isOpen: () => true,
      activeIndex: () => 1,
      resolvedOptions: () => options,
      setIsOpen: vi.fn(),
      setActiveIndex: vi.fn(),
      selectOption,
      close: vi.fn(),
    });

    handler(createKeyboardEvent('Enter'));

    expect(selectOption).toHaveBeenCalledWith({ value: 2, label: 'Two' });
  });

  it('should close and stop propagation on Escape when open', () => {
    const close = vi.fn();
    const event = createKeyboardEvent('Escape');

    const handler = setupComboboxKeyboardHandling({
      isOpen: () => true,
      activeIndex: () => 0,
      resolvedOptions: () => options,
      setIsOpen: vi.fn(),
      setActiveIndex: vi.fn(),
      selectOption: vi.fn(),
      close,
    });

    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
