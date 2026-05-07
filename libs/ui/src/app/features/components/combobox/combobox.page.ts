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
  readonly remoteComboboxControl = new FormControl<number | null>(null);

  readonly localOptions: ComboboxOption<string>[] = [
    { value: 'sp', label: 'Sao Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais' },
    { value: 'ba', label: 'Bahia' },
    { value: 'pr', label: 'Parana' },
    { value: 'sc', label: 'Santa Catarina' },
    { value: 'rs', label: 'Rio Grande do Sul' },
    { value: 'pe', label: 'Pernambuco' },
  ];

  readonly usersResourceFactory: ComboboxResourceFactory<number> = (filter: Signal<string>) =>
    resource({
      params: () => filter(),
      defaultValue: [],
      loader: ({ params, abortSignal }) => {
        const query = params.trim();
        const endpoint = query
          ? `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`
          : 'https://dummyjson.com/users?limit=8';

        return fetch(endpoint, { signal: abortSignal })
          .then((res) => res.json())
          .then(
            (data: {
              users: { id: number; firstName: string; lastName: string; email: string }[];
            }) =>
              data.users.map(
                (user) =>
                  ({
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.id,
                    data: user,
                  }) as ComboboxOption<number>,
              ),
          );
      },
    });
}
