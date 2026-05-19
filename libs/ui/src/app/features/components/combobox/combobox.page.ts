import { Tabs } from '@/shared/components/tabs';
import { Component, resource, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Section } from '../../../core/components/section';
import {
  Combobox,
  ComboboxOption,
  ComboboxResourceFactory,
} from '../../../shared/components/combobox/combobox';

@Component({
  selector: 'app-combobox-page',
  templateUrl: './combobox.page.html',
  imports: [ReactiveFormsModule, Section, Tabs, Combobox],
})
export class ComboboxPage {
  readonly localComboboxControl = new FormControl<string | null>(null);
  readonly localMultipleComboboxControl = new FormControl<string[]>([], { nonNullable: true });
  readonly remoteComboboxControl = new FormControl<number | null>(15);

  readonly localOptions: ComboboxOption<string>[] = [
    { value: 'sp', label: 'Sao Paulo', data: undefined },
    { value: 'rj', label: 'Rio de Janeiro', data: undefined },
    { value: 'mg', label: 'Minas Gerais', data: undefined },
    { value: 'ba', label: 'Bahia', data: undefined },
    { value: 'pr', label: 'Parana', data: undefined },
    { value: 'sc', label: 'Santa Catarina', data: undefined },
    { value: 'rs', label: 'Rio Grande do Sul', data: undefined },
    { value: 'pe', label: 'Pernambuco', data: undefined },
  ];

  readonly usersResourceFactory: ComboboxResourceFactory<unknown, any> = (
    filter: Signal<string>,
    selectedValues: Signal<unknown[]>,
  ) =>
    resource({
      params: () => ({
        filter: filter(),
        selectedValues: selectedValues(),
      }),
      defaultValue: [],
      loader: async ({ params, abortSignal }) => {
        const query = params.filter.trim();
        const endpoint = query
          ? `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`
          : 'https://dummyjson.com/users?limit=8';

        const searchedUsers = await fetch(endpoint, { signal: abortSignal })
          .then((res) => res.json())
          .then((data: { users: { id: number; firstName: string; lastName: string }[] }) =>
            data.users.map((user) => ({
              label: `${user.firstName} ${user.lastName}`,
              value: user.id,
              data: user,
            })),
          );

        const selectedIds = params.selectedValues
          .map((value) => (typeof value === 'number' ? value : Number(`${value}`)))
          .filter((value) => Number.isInteger(value) && value > 0);

        const missingSelectedIds = selectedIds.filter(
          (id) => !searchedUsers.some((user) => Object.is(user.value, id)),
        );

        if (missingSelectedIds.length === 0) {
          return searchedUsers;
        }

        const selectedUsers = await Promise.all(
          missingSelectedIds.map((id) =>
            fetch(`https://dummyjson.com/users/${id}`, { signal: abortSignal })
              .then((res) => (res.ok ? res.json() : null))
              .then((user: { id: number; firstName: string; lastName: string } | null) =>
                user
                  ? ({
                      label: `${user.firstName} ${user.lastName}`,
                      value: user.id,
                      data: user,
                    } as ComboboxOption<number, any>)
                  : null,
              ),
          ),
        );

        return [
          ...searchedUsers,
          ...selectedUsers.filter((user): user is ComboboxOption<number> => !!user),
        ];
      },
    });
}
