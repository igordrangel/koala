```html
<app-combobox
  placeholder="Select a state"
  emptyMessage="No states found"
  [options]="localOptions"
  [formControl]="localComboboxControl"
/>

<app-combobox
  multiple
  placeholder="Select multiple states"
  emptyMessage="No states found"
  [options]="localOptions"
  [formControl]="localMultipleComboboxControl"
/>
```
