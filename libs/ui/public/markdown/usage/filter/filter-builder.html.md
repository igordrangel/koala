```html
<app-filter
  storageKey="my-app.filters"
  addFilterPlaceholder="Choose a filter type"
  [definitions]="filterDefinitions"
  (filtersChange)="handleFiltersChange($event)"
/>
```
