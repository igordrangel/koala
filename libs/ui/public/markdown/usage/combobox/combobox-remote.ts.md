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
  readonly remoteComboboxControl = new FormControl<number | null>(null);

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
```
