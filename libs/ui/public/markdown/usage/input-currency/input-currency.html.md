```html
<app-fieldset>
  <ng-container label>Currency</ng-container>
  <input
    field
    appInput
    type="text"
    placeholder="Type here"
    [formControl]="currencyControl"
    appMask="000.000.000-00"
  />
  @if (currencyControl.hasError('required')) {
    <span appValidatorHint>Currency is required</span>
  }
</app-fieldset>
```
