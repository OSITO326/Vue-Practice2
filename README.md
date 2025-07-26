# final-project

### Details of the Project

We have a `.json` as DataBase to simulate a backend with `json-server`.
The `.json` file simulate a POS of "Tos Store", we have 3 models (Products, Category, Brand), models `Category and Brand` they have a relationship with model `Products`.

---

#### Tasks

- [x] List all Categories
- [x] List all Brands
- [x] List all Products
- [x] CRUD Categories
- [x] CRUD Brands
- [x] CRUD Products
- [x] Filter search on Categories
- [x] Filter search on Brands
- [x] Filter search on Products

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

### Install packages 📦

```sh
npm install
# or
pnpm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
# or
pnpm dev
```

### Run `json-server` to simulate Backend

```bash
npm run db
#or
pnpm db
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
# or
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
