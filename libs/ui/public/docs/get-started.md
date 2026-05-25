# Koala UI – Get Started

Koala UI is an Angular component library inspired by shadcn/ui.
Components are installed directly into your project via the **Koala CLI**, giving you full control over the source code.

## 1. Install the CLI

```bash
npm install -g @koalarx/ui-cli

# or
bun add -g @koalarx/ui-cli
```

## 2. Create a new project

```bash
kl new example

# with custom package manager
kl new example --pm pnpm
```

## 3. Add components

```bash
kl install button,dropdown,modal
```

## 4. Initialize an existing Angular project (optional)

```bash
kl init --project my-angular-app
```

## 5. Check CLI version

```bash
kl version
```

## Available components

- **Alert** – `kl install alert`
- **Breadcrumb** – `kl install breadcrumb`
- **Button** – `kl install button`
- **Calendar** – `kl install calendar`
- **Checkbox** – `kl install checkbox`
- **Collapse** – `kl install collapse`
- **Combobox** – `kl install combobox`
- **Confirm** – `kl install confirm`
- **Data Table** – `kl install datatable`
- **Dropdown** – `kl install dropdown`
- **Fieldset** – `kl install fieldset`
- **Filter** – `kl install inline-filter`
- **Input CNPJ** – `kl install input-cnpj`
- **Input CPF** – `kl install input-cpf`
- **Input Currency** – `kl install input-currency`
- **Input Field** – `kl install input-field`
- **Loading** – `kl install loading`
- **Modal** – `kl install modal`
- **Pagination** – `kl install pagination`
- **Radio** – `kl install radio`
- **Range** – `kl install range`
- **Select** – `kl install select`
- **Side Window** – `kl install side-window`
- **Skeleton** – `kl install skeleton`
- **Stepper** – `kl install stepper`
- **Table** – `kl install table`
- **Tabs** – `kl install tabs`
- **Textarea** – `kl install textarea`
- **Toast** – `kl install toast`
- **Toggle** – `kl install toggle`
- **Tooltip** – `kl install tooltip`
- **Validator** – `kl install validator`
