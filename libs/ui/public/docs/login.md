# Login

The login block provides a user interface for users to enter their credentials and access the application. It typically includes fields for username/email and password, along with a submit button to initiate the login process.

## Installation

```bash
kl install login
```

## Examples

### Login Form (HTML)

```html
<form
  class="flex flex-col items-center justify-center py-20 gap-2"
  [formGroup]="formCredentials"
  (submit)="authenticate()"
>
  <app-fieldset class="w-full max-w-xs">
    <ng-container label>Username</ng-container>
    <input
      field
      appInput
      size="md"
      type="text"
      placeholder="Enter your username"
      [formControl]="formCredentials.controls.username"
    />
    @if (formCredentials.controls.username.hasError('required')) {
    <span appValidatorHint>Username is required</span>
    }
  </app-fieldset>
  <app-fieldset class="w-full max-w-xs">
    <ng-container label>Password</ng-container>
    <input
      #inputPassword
      field
      appInput
      size="md"
      type="password"
      [formControl]="formCredentials.controls.password"
    />
    <ng-container action>
      @if (inputPassword.type === 'password') {
      <button
        type="button"
        appButton
        btnCircle
        btnVariant="ghost"
        (click)="inputPassword.type = 'text'"
      >
        <i class="fa-regular fa-eye-slash"></i>
      </button>
      } @else {
      <button
        type="button"
        appButton
        btnCircle
        btnVariant="ghost"
        (click)="inputPassword.type = 'password'"
      >
        <i class="fa-regular fa-eye"></i>
      </button>
      }
    </ng-container>
    @if (formCredentials.controls.password.hasError('required')) {
    <span appValidatorHint>Password is required</span>
    } @else if (formCredentials.controls.password.hasError('minlength')) {
    <span appValidatorHint>Password must be at least 8 characters</span>
    }
  </app-fieldset>
  <button appButton type="submit" class="w-full max-w-xs mt-4">Login</button>
</form>
```

### Login Form (TypeScript)

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Credentials } from '../../../core/models/credentials';
import { AuthorizationService } from '../../../core/security/authorization.service';
import { Button } from '../../../shared/components/button/button';
import { Fieldset } from '../../../shared/components/fieldset/fieldset';
import { Input } from '../../../shared/components/input-field/input';
import { ValidatorHint } from '../../../shared/components/validator/validator-hint';
import { Loading } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-login-form-sample',
  templateUrl: './login-form.sample.html',
  imports: [ReactiveFormsModule, Fieldset, Input, ValidatorHint, Button, Loading],
})
export class LoginFormSample {
  readonly authorization = inject(AuthorizationService);

  readonly formCredentials = inject(FormBuilder).group({
    username: new FormControl('emilys', Validators.required),
    password: new FormControl('emilyspass', [Validators.required, Validators.minLength(8)]),
  });

  authenticate() {
    this.authorization.auth(this.formCredentials.value as Credentials);
  }
}
```

### Logged User (HTML)

```html
@if (authorization.loggedUser(); as loggedUser) {
<div class="flex flex-col items-center justify-center gap-4 py-20">
  <div class="avatar">
    @if (avatarLoading()) {
    <app-skeleton variant="circle" class="w-24 h-24 absolute inset-0" />
    }
    <div
      class="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2 relative transition-opacity duration-300"
      [class.opacity-0]="avatarLoading()"
    >
      <img [src]="loggedUser.avatar" (load)="avatarLoading.set(false)" />
    </div>
  </div>
  <span>{{ loggedUser.name }}</span>
  <div class="join">
    <button appButton btnVariant="primary" (click)="authorization.updateToken().subscribe()">
      Refresh Token
    </button>
    <button appButton btnVariant="error" (click)="authorization.logout()">Logout</button>
  </div>
</div>
}
```

### Logged User (TypeScript)

```typescript
import { Component, inject, signal } from '@angular/core';
import { AuthorizationService } from '../../../core/security/authorization.service';
import { Button } from '../../../shared/components/button/button';
import { Skeleton } from '../../../shared/components/skeleton/skeleton';

@Component({
  selector: 'app-logged-sample',
  templateUrl: './logged-sample.html',
  imports: [Button, Skeleton],
})
export class LoggedSample {
  readonly avatarLoading = signal(true);
  readonly authorization = inject(AuthorizationService);
}
```
