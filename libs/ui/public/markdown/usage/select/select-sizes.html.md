```html
<select appSelect size="xs" [formControl]="selectControl">
  @for (option of options; track $index) {
    <option [value]="option.value">{{ option.label }}</option>
  }
</select>
<select appSelect size="sm" [formControl]="selectControl">
  @for (option of options; track $index) {
    <option [value]="option.value">{{ option.label }}</option>
  }
</select>
<select appSelect size="md" [formControl]="selectControl">
  @for (option of options; track $index) {
    <option [value]="option.value">{{ option.label }}</option>
  }
</select>
<select appSelect size="lg" [formControl]="selectControl">
  @for (option of options; track $index) {
    <option [value]="option.value">{{ option.label }}</option>
  }
</select>
<select appSelect size="xl" [formControl]="selectControl">
  @for (option of options; track $index) {
    <option [value]="option.value">{{ option.label }}</option>
  }
</select>
```
