```html
<app-input-field>
  <ng-container label>What is your email?</ng-container>
  <input appInput type="text" placeholder="Type here" [formControl]="emailControl" />
  <ng-container hint>Inform a valid email address</ng-container>

  @if (emailControl.hasError('required')) {
    <span appValidatorHint>Email is required</span>
  } @else if (emailControl.hasError('email')) {
    <span appValidatorHint>Invalid email</span>
  }
</app-input-field>
```
