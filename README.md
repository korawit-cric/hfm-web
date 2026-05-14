# hfm-web

A full-stack monorepo featuring NestJS APIs, Next.js frontends, and Prisma ORM with PostgreSQL.

**Turborepo** keeps the API, web app, Prisma layer, and shared packages in one workspace with unified tooling and incremental builds. Real slices of the stack (DTOs, services, controllers on the server; feature modules plus typed fetch helpers on the web) double as a template for new features. **Prisma**, **Swagger**, and repo-wide **lint / typecheck / tests** keep models, HTTP contracts, and quality checks consistent.

## What's inside?

This Turborepo includes the following packages & apps:

### Apps and Packages

```shell
.
├── apps
│   ├── web                # hfm-frontend (Next.js 16)   → http://localhost:3000
│   ├── api                # hfm-api (NestJS 11)         → http://localhost:3001
│   └── db                 # hfm-db (PostgreSQL 16, Docker)  → localhost:5433
└── packages
    ├── @repo/api-client          # Frontend API definitions & types (no fetch)
    ├── @repo/design-system       # Tailwind 4 config, colors, global styles
    ├── @repo/eslint-config       # ESLint configurations (includes Prettier)
    ├── @repo/icons               # SVG icon components (SVGR-generated)
    ├── @repo/jest-config         # Jest configurations
    ├── @repo/prisma              # Prisma 7 client, schema, and types
    ├── @repo/typescript-config   # TypeScript configurations
    └── @repo/ui                  # React 19 component library with Tailwind
```

Everything below is **TypeScript** unless noted.

**Apps**

| Path       | Role            | Main versions                                                      | URL / port                  |
| ---------- | --------------- | ------------------------------------------------------------------ | --------------------------- |
| `apps/web` | Next.js UI      | Next ^16.0.7, React ^19.1.0, next-intl ^4.11, TanStack Query ^5.80 | <http://localhost:3000>     |
| `apps/api` | NestJS REST API | Nest ^11, Swagger @nestjs/swagger ^11                              | <http://localhost:3001/api> |
| `apps/db`  | PostgreSQL      | 16-alpine (Docker)                                                 | localhost:5433              |

**Packages**

| Package                   | Role                             | Notable versions   |
| ------------------------- | -------------------------------- | ------------------ |
| `@repo/prisma`            | ORM, schema, shared DB types     | Prisma ^7.1.0      |
| `@repo/api-client`        | Typed paths/methods (no fetch)   | —                  |
| `@repo/design-system`     | Tailwind 4 tokens, global styles | Tailwind ^4.1.x    |
| `@repo/ui`                | Shared React components          | React 19, Tailwind |
| `@repo/icons`             | SVGR → React icons               | SVGR ^8.1.0        |
| `@repo/eslint-config`     | Lint (+ Prettier integration)    | ESLint 9           |
| `@repo/typescript-config` | Shared TS configs                | TS ~5.8            |
| `@repo/jest-config`       | Shared Jest setup                | Jest 30            |

**Runtime & repo tooling:** Node.js **≥22.12** · **Turborepo** · **Docker Compose** (DB) · **Husky** · **Commitlint** (conventional commits)

## Getting Started

### Prerequisites

- Node.js >= 22.12 (required for Prisma 7)
- Docker and Docker Compose (for PostgreSQL database)
- npm (recommended)

### Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

   This will automatically:
   - Create `.env` from `.env.example` if it doesn't exist
   - Set up the environment configuration

2. **Start PostgreSQL database**:

   ```bash
   npm run db:start
   ```

3. **Configure database connection** (if needed):

   The `.env` file is automatically created from `.env.example` during `npm install`. If you need to update it, edit the root `.env` file:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/hfm-db?schema=public"
   ```

   **Note**: When you run `npm run dev`, the root `.env` file is automatically distributed to all apps and packages (except config packages) via symlinks. This ensures all parts of the monorepo use the same environment variables.

4. **Generate Prisma client and push schema**:

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start development servers**:

   ```bash
   npm run dev
   ```

   This will:
   - Automatically distribute the root `.env` file to all apps and packages
   - Start all development servers:
     - Web on <http://localhost:3000>
     - API on <http://localhost:3001>

### Commands

This `Turborepo` includes useful commands for all apps and packages.

#### Database Commands

```bash
# Start PostgreSQL database
npm run db:start
# or
npm run db:up

# Stop PostgreSQL database
npm run db:stop
# or
npm run db:down

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

**Note**: The `predev` script automatically creates symlinks from the root `.env` to each app and package (excluding config packages like `eslint-config`, `jest-config`, `typescript-config`).

#### test

```bash
# Will launch a test suites for all the app & packages with the supported `test` script.
npm run test

# You can launch e2e testes with `test:e2e`
npm run test:e2e

# See `@repo/jest-config` to customize the behavior.
```

#### Lint

```bash
# Will lint all the app & packages with the supported `lint` script.
# See `@repo/eslint-config` to customize the behavior.
npm run lint
```

#### Format

```bash
# Will format all the supported `.ts,.js,json,.tsx,.jsx` files.
# See `@repo/eslint-config/prettier-base.js` to customize the behavior.
npm run format
```

### Git Hooks & CI

#### Pre-commit

Automatically runs on every commit via Husky:

- **ESLint** + **Prettier** on staged `.ts/.tsx` files
- **Prettier** on staged `.json/.md/.css` files

#### Commit Messages

Uses [Conventional Commits](https://www.conventionalcommits.org/) format with required scope:

```bash
# Format: type(scope): message
feat(hfm-frontend): add user authentication
fix(api): resolve database connection issue
docs(readme): update installation steps
refactor(prisma): optimize query performance
```

**Allowed types:** `build`, `chore`, `docs`, `feat`, `fix`, `refactor`, `test`, `release`

#### GitHub Actions

Runs on all pushes and pull requests:

- ESLint across all packages
- Prettier format check
- TypeScript type checking

## Project Structure

### API (`apps/api`)

- **Swagger**: `http://localhost:3001/api` (and `3003` when that instance is used)
- **DTOs** use `@nestjs/swagger` and align with **Prisma** so request/response shapes track the schema

### Web (`apps/web`)

**`serverFetch`** in Server Components, **`clientFetch`** + TanStack Query in client features; types flow from **`@repo/api-client`**.

### Forms

- Shared primitives live in **`@repo/ui`**: `useCustomForm` wraps **react-hook-form** with **Zod** via `zodResolver`; `FormWrapper` provides `FormProvider` and submits with `handleSubmit`.
- **Localize validation messages** by building the Zod schema with a function that takes `t` from `useTranslations` (same idea as `apps/web/components/application-form-section.tsx`).
- Wire fields with `FormInput`, `FormDropdownSelect`, `FormCheckbox`, etc., from `@repo/ui/form/*`. Labels and placeholders use the same message namespace as validation strings.

```tsx
'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useCustomForm, FormWrapper } from '@repo/ui/form/form-wrapper';
import { FormInput } from '@repo/ui/form/form-input';

function buildSchema(t: (key: string) => string) {
  const req = () => t('applicationForm.errors.required');
  return z.object({
    firstName: z.string().min(1, req()),
    email: z
      .string()
      .min(1, req())
      .email(() => t('applicationForm.errors.email')),
  });
}

export function ExampleForm() {
  const t = useTranslations('HomePage');
  const schema = useMemo(() => buildSchema(t), [t]);
  const form = useCustomForm({
    defaultValues: { firstName: '', email: '' },
    schema,
    mode: 'onSubmit',
  });

  return (
    <FormWrapper formInstance={form} onSubmit={(data) => console.log(data)}>
      <FormInput
        name="firstName"
        placeholder={t('applicationForm.firstName')}
      />
      <FormInput
        name="email"
        type="email"
        placeholder={t('applicationForm.email')}
      />
    </FormWrapper>
  );
}
```

### Localization (next-intl)

- Routing and locales: `apps/web/lib/i18n/routing.ts` (e.g. `en`, `th`; default `en`).
- Request config and message loading: `apps/web/lib/i18n/request.ts` pulls `messages/{locale}.json`.
- **Always** use `Link`, `redirect`, `useRouter`, and path helpers from `apps/web/lib/i18n/navigation.ts` so the active locale is preserved (not raw `next/link` for in-app routes).
- In Client Components, use `useTranslations('Namespace')` (and `useLocale()` when passing locale to the API). Server Components / layouts can use `getTranslations` from `next-intl/server` (see `lib/metadata/create-metadata.ts`).

Locale-aware navigation and copy:

```tsx
// apps/web — use this module for in-app links / redirects (locale-preserving)
import { Link, useRouter } from '@/lib/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

export function Example() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  return <Link href="/privacy">{t('applicationForm.privacyPolicy')}</Link>;
}
```

```tsx
// apps/web — pass API locale from the client (pattern used with countries, FAQs, etc.)
import { useLocale } from 'next-intl';

const locale = useLocale();
// queryFn: () => clientFetch(countriesApi.list(locale))
```

### Translation model on the backend

- Prisma defines a shared **`Locale`** enum and per-entity **`*Translation`** tables with `@@id([parentId, locale])` (`packages/prisma/prisma/schema.prisma`).
- Controllers accept **`?locale=`**; **`apps/api/src/common/parse-locale-param.ts`** normalizes to `Locale` (defaults to `en`).
- Services **`include: { translations: true }`**, resolve the best translation row, and **`BadRequestException`** if none exist when localized output is required.

```prisma
// packages/prisma/prisma/schema.prisma (shape used across FQA, Country, Experience, …)
enum Locale {
  en
  th
}

model Country {
  id           Int                  @id @default(autoincrement())
  translations CountryTranslation[]
  // …
}

model CountryTranslation {
  countryId Int
  locale    Locale
  name      String
  country   Country @relation(fields: [countryId], references: [id], onDelete: Cascade)

  @@id([countryId, locale])
}
```

```typescript
// apps/api — query param
@Get()
findAll(@Query('locale') locale?: string) {
  return this.countriesService.findAll(parseLocaleParam(locale));
}
```

```typescript
// apps/api — pick requested locale, then en, then any row
import { BadRequestException } from '@nestjs/common';
import { Locale } from '@repo/prisma';

private pickTranslation(entity: { id: number; translations: { locale: Locale; name: string }[] }, locale: Locale) {
  const row =
    entity.translations.find((tr) => tr.locale === locale) ??
    entity.translations.find((tr) => tr.locale === Locale.en) ??
    entity.translations[0];
  if (!row) {
    throw new BadRequestException(`Entity ${entity.id} has no translations`);
  }
  return { id: entity.id, name: row.name };
}
```

### Shared Packages

- **@repo/api-client**: Frontend API definitions (no fetch, no React, no Next.js)
  - Endpoint definitions with typed request/response
  - Runtime-agnostic — server and client

- **@repo/prisma**: Shared Prisma client and schema
  - Exports singleton Prisma client instance
  - Exports Prisma types for API and web
  - **Ready to publish as an npm package** (see [packages/prisma README](./packages/prisma/README.md))

- **@repo/design-system**: Shared Tailwind 4 foundation (tokens, globals, PostCSS preset) — see [Design system structure](#design-system-structure)

- **@repo/icons**: SVG → React via SVGR — see [packages/icons README](./packages/icons/README.md)

- **@repo/ui**: Shared React component library
  - Reusable components (Button, Card, etc.)
  - Built with Tailwind CSS from `@repo/design-system`

### Design system structure

The design system is split so **tokens and global rules** stay in one package, **React primitives** consume them, and the **app** adds only layout or page-specific CSS.

**`packages/design-system`** (`@repo/design-system`)

| Path / export                            | Role                                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared-styles.css` (export `.`)         | Tailwind 4 foundation: `@theme` tokens, `@theme inline` + **Next.js font** variables, custom `@utility`, `@layer base` for form controls, global resets |
| `postcss.config.js` (export `./postcss`) | Shared **`postcssConfig`** (`@tailwindcss/postcss`) for apps                                                                                            |

Details in **`shared-styles.css`**: primary / secondary / status palettes, neutrals, `background` and `foreground`, typography scale (e.g. `--text-xxs`), gold-gradient image + `text-gold-gradient` utility, and base styles for inputs, textareas, selects, placeholders, and autofill.

Excerpt from [`packages/design-system/shared-styles.css`](./packages/design-system/shared-styles.css):

```css
@import 'tailwindcss';

@theme {
  --color-*: initial; /* drop Tailwind default palette; tokens below drive utilities */

  --color-primary-300: #93d9b8;
  --color-primary-500: #179149;
  --color-primary-700: #176c38;

  --background-image-gold-gradient: linear-gradient(
    90deg,
    #fcd678 0%,
    #fcd678 0.01%,
    #bc8c2f 100%
  );

  --background: #f4f4f4;
  --foreground: #161616;
  --text-xxs: 10px;
  /* …secondary, status, neutrals, borders, and more in the repo… */
}

/* Bridges next/font CSS variables to Tailwind font utilities */
@theme inline {
  --font-open-sans: var(--font-open-sans);
  --font-ibm-plex-sans-thai: var(--font-ibm-plex-sans-thai);
  --font-sofia-sans-condensed:
    var(--font-sofia-sans-condensed), var(--font-ibm-plex-sans-thai);
}

@utility text-gold-gradient {
  background-image: var(--background-image-gold-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
```

**How apps and UI consume it**

1. **`apps/web`** — `app/globals.css` imports `@tailwindcss` then `@repo/design-system`; add app-only rules (e.g. layout grids) beside those imports. `postcss.config.mjs` re-exports `postcssConfig` from `@repo/design-system/postcss`.
2. **`@repo/ui`** — `src/styles.css` imports `@repo/design-system`, then defines **component-local** `@utility` / keyframes (e.g. accordion animations). The package **`build:styles`** emits `dist/index.css`; consumers use `@repo/ui/styles.css` alongside JS exports from `@repo/ui/*`.

**Mental model:** `@repo/design-system` = single source of truth for **theme + globals**; `@repo/ui` = **layered styles + components** on top; `apps/web` = **product-specific** CSS only where needed.

### Data Fetching Architecture

This project separates **API definitions** from **fetch logic** for maximum flexibility:

```
@repo/api-client (shared)    apps/hfm-frontend (per-app, path `apps/web`)
┌─────────────────────┐      ┌─────────────────────────────────┐
│ linksApi.list()     │      │ lib/fetch/server.ts (SSR)       │
│ linksApi.detail(id) │ ──▶  │ lib/fetch/client.ts (CSR)       │
│ linksApi.create()   │      │ features/links/queries.ts       │
└─────────────────────┘      └─────────────────────────────────┘
```

**How it works:**

1. **`@repo/api-client`** defines endpoints as pure data (no fetch):

```typescript
// packages/api-client/src/links.ts
export const linksApi = {
  list: () => ({ url: '/links', method: 'GET' }),
  detail: (id: number) => ({ url: `/links/${id}`, method: 'GET' }),
  create: (data) => ({ url: '/links', method: 'POST', body: data }),
};
```

2. **Each app** has its own fetch utilities that consume these definitions:

```typescript
// apps/web/lib/fetch/server.ts — Server Components / route handlers
// next.revalidate: shared TTL (e.g. 30 minutes) for GET-style reads
export async function serverFetch<T>(endpoint: ApiEndpoint<T>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
    method: endpoint.method,
    body: endpoint.body ? JSON.stringify(endpoint.body) : undefined,
    next: { revalidate: 1800 },
  });
  // …parse JSON, throw on error
}

// apps/web/lib/fetch/client.ts — browser / TanStack Query
// Optional parseResponse() for custom status handling (e.g. form POST → discriminated result)
export async function clientFetch<T>(endpoint: ApiEndpoint<T>): Promise<T> {
  // …default: throw if !ok, else JSON parse; TanStack Query owns client caching
}
```

3. **Usage** differs by component type:

**Server Components** use `serverFetch()` directly:

```typescript
// apps/web/app/(home)/page.tsx (Server Component)
import { linksApi } from '@repo/api-client';
import { serverFetch } from '../../lib/fetch/server';

export default async function Page() {
  const links = await serverFetch(linksApi.list());
  return <LinksList links={links} />;
}
```

**Client Components** use TanStack Query hooks:

```typescript
// apps/web/features/links/links-client.tsx
'use client';
import { useLinksQuery } from './queries';

export function LinksClient() {
  const { data: links, isLoading } = useLinksQuery();
  if (isLoading) return <Loading />;
  return <LinksList links={links} />;
}
```

**Why this pattern?**

- ✅ **Share definitions, not fetch** - `@repo/api-client` has no fetch, no React, no Next.js
- ✅ **Per-app control** - Each app manages caching, headers, error handling
- ✅ **Server vs client separation** - Different strategies for SSR and CSR
- ✅ **Type safety** - Full TypeScript inference from endpoint to response
- ✅ **Easy to test** - Mock endpoints without mocking fetch

### SEO & indexing (`apps/web`)

Brief stack for crawlers and previews:

| Piece                                                     | Role                                                                                    |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `lib/metadata/create-metadata.ts`                         | Locale-aware `generateMetadata` (canonical, `hreflang`, Open Graph, Twitter)            |
| `lib/sitemap/registry.ts` + `app/sitemap.ts`              | Route registry; `/sitemap.xml` per locale (`NEXT_PUBLIC_BASE_URL`)                      |
| `scripts/generate-robots.js` (`postbuild` on the web app) | Writes `public/robots.txt` (full allow + sitemap in production; disallow all otherwise) |
| `lib/metadata/create-organization-schema.ts`              | JSON-LD `Organization` in the locale layout                                             |

See root **`.env.example`** for `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SITE_NAME`, optional logo/social overrides, and `APP_ENV` (robots behavior).

### Environment Variables

The project uses a centralized `.env` file in the root directory:

- **Automatic Setup**: `.env` is created from `.env.example` during `npm install`
- **Automatic Distribution**: When running `npm run dev`, the root `.env` is distributed to all apps and packages via symlinks
- **Excluded Packages**: Config packages (`eslint-config`, `jest-config`, `typescript-config`) don't receive `.env` files
- **Single Source of Truth**: All environment variables are managed in the root `.env` file

**Web (see `.env.example`)**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BASE_URL` (canonical / sitemap), `NEXT_PUBLIC_SITE_NAME` / optional logo & social URLs for metadata + JSON-LD, `APP_ENV` for production-style `robots.txt` after build.
