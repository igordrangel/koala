```typescript
import { Component, resource, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Combobox,
  ComboboxOption,
  ComboboxResourceFactory,
} from '@/shared/components/combobox/combobox';

@Component({
  selector: 'app-combobox-remote-sample',
  templateUrl: './combobox-remote-sample.html',
  imports: [ReactiveFormsModule, Combobox],
})
export class ComboboxRemoteSample {
  readonly remoteComboboxControl = new FormControl<number | null>(15);

  readonly usersResourceFactory: ComboboxResourceFactory<number> = (
    filter: Signal<string>,
    selectedValues: Signal<number[]>,
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
            data.users.map(
              (user) =>
                ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                  data: user,
                }) as ComboboxOption<number>,
            ),
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
                    } as ComboboxOption<number>)
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
```
