```html
<div class="grid gap-4 md:grid-cols-2">
  <div class="flex flex-col gap-2">
    <span class="text-sm font-semibold">date</span>
    <app-input-calendar [(value)]="inputDateValue" />
    <span class="opacity-60">value: {{ inputDateValue() }}</span>
  </div>

  <div class="flex flex-col gap-2">
    <span class="text-sm font-semibold">datetime</span>
    <app-input-calendar type="datetime" [(value)]="inputDateTimeValue" />
    <span class="opacity-60">value: {{ inputDateTimeValue() }}</span>
  </div>

  <div class="flex flex-col gap-2">
    <span class="text-sm font-semibold">month</span>
    <app-input-calendar type="month" [(value)]="inputMonthValue" />
    <span class="opacity-60">value: {{ inputMonthValue() }}</span>
  </div>

  <div class="flex flex-col gap-2">
    <span class="text-sm font-semibold">daterange</span>
    <app-input-calendar type="daterange" [(value)]="inputDateRangeValue" />
    <span class="opacity-60">value: {{ inputDateRangeValue() }}</span>
  </div>
</div>
```
