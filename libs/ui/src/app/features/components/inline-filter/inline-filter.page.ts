import { JsonPipe } from '@angular/common';
import { Component, inject, Injector, resource, signal, Signal } from '@angular/core';
import { KlArray } from '@koalarx/utils/KlArray';
import { Section } from '../../../core/components/section';
import { InlineFilter, InlineFilterBuilder } from '../../../shared/components/inline-filter';
import { Tabs } from '../../../shared/components/tabs';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  eyeColor: string;
}

@Component({
  selector: 'app-inline-filter-page',
  templateUrl: './inline-filter.page.html',
  imports: [JsonPipe, Section, InlineFilter, Tabs],
})
export class InlineFilterPage {
  private readonly usersResourceFactory = (
    filter: Signal<string>,
    values: Signal<number[]>,
    injector: Injector,
  ) =>
    resource({
      injector,
      params: () => ({
        selectedValues: values(),
        filter: filter?.() ?? '',
      }),
      defaultValue: [],
      loader: async ({ params, abortSignal }) => {
        const sortBy = 'firstName';
        const order = 'asc';
        const selectedIds = params.selectedValues;

        const endpoint = `https://dummyjson.com/users?limit=300&sortBy=${sortBy}&order=${order}`;

        const response = await fetch(endpoint, { signal: abortSignal });
        const data: { users: User[]; total: number } = await response.json();

        const users =
          new KlArray<User>([
            ...data.users.filter((item) => selectedIds.includes(item.id)),
            ...data.users.filter((item) => !selectedIds.includes(item.id)),
          ])
            .orderBy('firstName', 'asc')
            .split(30)[0] ?? [];

        return users.map((user) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
          data: user,
        }));
      },
    });

  readonly appliedFilters = signal<any[]>([]);
  readonly inlineFilterConfig = inject(InlineFilterBuilder)
    .input('Author', 'author', 'text', { placeholder: 'e.g. igor' })
    .input('CPF', 'cpf', 'cpf')
    .input('CNPJ', 'cnpj', 'cnpj')
    .select('Status', 'status', [
      { value: 'open', label: 'Open', data: undefined },
      { value: 'closed', label: 'Closed', data: undefined },
      { value: 'draft', label: 'Draft', data: undefined },
    ])
    .select(
      'Labels',
      'labels',
      [
        { value: 'frontend', label: 'Frontend', data: undefined },
        { value: 'backend', label: 'Backend', data: undefined },
        { value: 'docs', label: 'Documentation', data: undefined },
        { value: 'design-system', label: 'Design System', data: undefined },
      ],
      { multiple: true },
    )
    .select('Type', 'type', [
      { value: 'feat', label: 'Feature', data: undefined },
      { value: 'fix', label: 'Fix', data: undefined },
      { value: 'docs', label: 'Docs', data: undefined },
      { value: 'refactor', label: 'Refactor', data: undefined },
    ])
    .combobox('Assignee', 'assignee', this.usersResourceFactory, {})
    .calendar('Created after', 'createdAfter')
    .input('Min comments', 'minComments', 'number', { placeholder: '0' })
    .input('Contact e-mail', 'contactEmail', 'email')
    .input('Price', 'price', 'currency')
    .build();
}
