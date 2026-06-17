# Koala

Landing page estática do ecossistema **Koala** — índice das bibliotecas:

| Biblioteca | Pacote | Documentação |
| --- | --- | --- |
| **Koala UI** | `@koalarx/ui` | [ui.koalarx.com](https://ui.koalarx.com) |
| **Koala Nest** | `@koalarx/nest` | [nest.koalarx.com](https://nest.koalarx.com) |
| **Koala Utils** | `@koalarx/utils` | [GitHub](https://github.com/igordrangel/koala-utils) |

Site publicado em **[koalarx.com](https://koalarx.com)**.

## Desenvolvimento

```bash
bun install
bun run start
```

Rotas: `/pt` (padrão) e `/en`. A raiz `/` redireciona para `/pt`.

## Build (SSG)

Gera site estático em `dist/koala/browser`:

```bash
bun run build
bun run preview   # http://localhost:4321
```

## Deploy (GitHub Pages)

O workflow `.github/workflows/deploy-docs.yml` faz build e publica no GitHub Pages ao push na branch `main`.

1. No repositório GitHub: **Settings → Pages → Build and deployment → GitHub Actions**
2. DNS do domínio customizado: `koalarx.com` (arquivo `public/CNAME`)
3. Após o merge em `main`, o site fica disponível em [koalarx.com](https://koalarx.com)

## Stack

- Angular 21 com SSG (`outputMode: static`)
- Koala UI (tema `koala`, Tailwind CSS v4, DaisyUI)
- Design alinhado a [koala-ui](https://ui.koalarx.com) e [koala-nest](https://nest.koalarx.com)

## Licença

MIT © [Igor D. Rangel](https://igordrangel.com.br/)
