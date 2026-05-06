<div align="center">
  <h1>@koalarx/ui-cli</h1>
  <p>CLI for creating and managing Angular projects with ready-to-use UI components.</p>

[![npm version](https://img.shields.io/npm/v/@koalarx/ui-cli)](https://www.npmjs.com/package/@koalarx/ui-cli)
[![license](https://img.shields.io/npm/l/@koalarx/ui-cli)](./LICENSE)

**[📖 Full Documentation → koalarx.com](https://koalarx.com)**

</div>

---

## Installation

```bash
npm install -g @koalarx/ui-cli
```

or with bun:

```bash
bun add -g @koalarx/ui-cli
```

---

## Commands

### `kl new`

Creates a new Angular project with the Koala structure and dependencies already configured.

During project creation, the CLI asks which package manager you want to use:

- `bun`
- `npm`
- `yarn`
- `pnpm`

You can also skip the interactive prompt by passing the `--pm` flag.

```bash
kl new --name meu-projeto
kl new --name my-project --pm npm
```

---

### `kl component`

Adds one or more UI components to the project.

```bash
kl component --name button
kl component --name button,loading,dropdown
kl component --name modal --project meu-projeto
```

---

## Documentation

For detailed installation guides, usage instructions, and examples for each component, visit the official documentation:

**[koalarx.com](https://koalarx.com)**
