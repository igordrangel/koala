```html
<app-combobox
  placeholder="Search for a user"
  searchingMessage="Searching..."
  emptyMessage="No users found"
  [resourceFactory]="usersResourceFactory"
  [formControl]="remoteComboboxControl"
/>
```
