# Agent Instructions

Greenfield project — no users, no back-compat concerns. Make it right.

## Workflow

- Package manager: **pnpm**
- Before marking any task complete: run `pnpm style` and `pnpm typecheck`
- After meaningful TypeScript or JavaScript changes, run `pnpm run audit:code`
- Before opening a PR, run `pnpm check`, `pnpm typecheck`, `pnpm test`, and `pnpm exec fallow audit --base origin/main`
- Never push to `main`
- Never run `pnpm dev` unless instructed
- Never run `pnpm release` or `convex deploy` unless instructed — production Convex deploys from the Vercel production build
- When testing local URLs, always use `https`

Use the Fallow skill for deeper audit and debug workflows.

## Testing

- Test behavior, not implementation. Add a test only if it would catch a real regression; a bug fix gets a test that fails without the fix.
- Use the lowest layer that proves it: pure logic with Vitest (`*.test.ts`), Convex functions with `convex-test` (`convex/**/*.test.ts` under edge-runtime), interactive components with Vitest + RTL (happy-dom), and critical journeys with Playwright (`e2e/*.spec.ts`) on a seeded preview. `pnpm test` runs Vitest.
- Never read source or match code strings, snapshot markup, mock Convex or Next internals, test the framework, or duplicate another layer's coverage.
- Query UI by role, label, or text. Keep tests independent and deterministic, and seed their own data.
- Components that emit analytics get a component test that mocks `@/services/analytics` and asserts `track`'s call count, event name, and properties, using shared helpers (create them with the first test). E2E tests cover workflows and data, not events.

## Conventions

- No emojis anywhere: code, commits, descriptions, PR titles
- Conventional commit format for PR titles and commit messages (the PR title is the squash-merge commit)
- Alphabetize: imports, object keys, destructured props, component prop lists
  - Exception: group related items together if alphabetical order hurts readability

## Code Comments

JSDoc only when adding context beyond the function name (1–2 lines max). Skip `@param`/`@returns` unless documenting non-obvious constraints, defaults, or side effects. Never: commented-out code, obvious comments, redundant type docs.

## Linear

Always use the **gettreadtalks.com** project (`441dc110-d73c-46cb-b395-1c762d7e2958`) when searching, creating, or updating Linear issues for this codebase.

## Rules

Never show env var names, stack traces, raw internal `error.message`, or config details in user-facing UI. Report those to Sentry with `reportUnexpectedError` and show a plain, friendly message. Keep the details in development/console.

## Architecture

### Feature-Based Organization

Code is organized by **domain/feature**, not technical layer.

**Directory Structure:**

- `convex/` - Database schema + backend functions
- `convex/model/` - Entity-specific helpers organized by domain
- `src/app/` - Next.js App Router pages
- `src/components/` - Shared UI components
- `src/constants/` - Shared constants
- `src/features/` - Business domains (talks, users, clips, speakers, topics, collections)
- `src/lib/` - Shared helpers used across features (forms, entities)
- `src/services/` - Integration boundaries (auth, email, errors, analytics)
- `src/utils/` - Generic utilities

`services/` wraps outside systems (vendor/client lifecycle). `lib/` is shared internal helpers. Helpers in `lib/` may call `services/`; do not put vendor clients in `lib/`.

**Path Alias:** `@/*` maps to `src/*`

### Feature Structure

```sh
src/features/{domain}/
├─ actions/    # Server actions (writes)
├─ components/ # Feature-specific components
├─ hooks/      # Client hooks (mutations/forms only)
├─ queries/    # Server queries (reads)
├─ schemas/    # Zod validations
├─ types.ts    # All types
└─ utils.ts    # Shared utils
```

### Component Organization

1. **Shared** — `src/components/` — Used across features
2. **Feature** — `src/features/{domain}/components/` — Feature-specific
3. **Route** — `src/app/{route}/_components/` — Route-specific

Page composition and Suspense wrappers that read `params` or `searchParams` stay in `src/app/{route}/_components`. Presentational, URL-agnostic pieces go in `src/features/{domain}/components`. Move to the feature folder only when a second route needs it.

**UI Primitives:** Files in `src/components/ui/primitives/` are vendor components — never edit directly. Create wrappers in `src/components/ui/`. Always import from `@/components/ui`, never from `@/components/ui/primitives/*` in feature or page code.

**Overlays**

- Dialog — centered blocking UI (confirm, alert)
- Sheet — side/bottom panel that is a non-nested modal overlay
- Drawer — edge panel where swipe-to-dismiss is the product (nav, mobile filters, nested FormSheet)

**Naming:** kebab-case for all `src/` folders

**Colocation:** One responsibility per file. Simple components stay as `component-name.tsx`. When a component has multiple pieces (subcomponents, hooks, utils, types), colocate them in a directory:

```
component-name/
├─ index.ts              # public exports
├─ component-name.tsx    # main component
├─ piece.tsx
└─ utils.ts
```

Do not split a simple component just to match the directory shape.

### Rendering & data loading

Pages and layouts stay synchronous. Put `params`, `searchParams`, cookies, headers, and auth in small async children, each behind its own `<Suspense>` (separate boundaries for filters vs results; `fallback={null}` only for small pieces). No per-route `loading.tsx` on listings. Auth via `AdminGate` / `UserGate` — do not await `requireCurrentUser` / `requireAdminUser` in the layout.

Public reads live in `src/features/*/queries` with `'use cache'`, `cacheLife()`, and `cacheTag()`. Mutations call `updateTag()` (`refresh()` only when that is not enough). Public listing and detail pages export `ensureStatic = 'shell'`. React Compiler is on. Use `Link` from `@/components/ui/link`, not `next/link` directly; default prefetch.

## Convex

### File Structure

- `convex/{domain}.ts` - Public API exports
- `convex/model/{domain}/` - Entity helpers (queries.ts, mutations.ts, schema.ts, validators.ts)
- `convex/model/auth/` - Authentication helpers
- `convex/lib/` - Shared utilities
- Client provider: mount `AuthProvider` only in layouts that need the Convex client (`/account`, `/manage`, auth routes) and in lazy islands for favorite/finished actions.

### File Naming

Convex only allows alphanumeric characters, underscores, and periods in file/folder names. Kebab-case is not supported and will cause deployment errors.

- Multi-word files/folders: **camelCase** (e.g., `affiliateLinks.ts`, `betterAuth/`, `rotateContent.ts`)
- Single-word files: lowercase (e.g., `filters.ts`, `sort.ts`, `utils.ts`)

### Naming Conventions

_Queries:_

- `get*` — Single document or null
- `list*` — Filtered/public array with enrichment
- `listAll*` — Unfiltered array for admin
- `listAll*` is admin-only; registered queries are named for what they return
- `search*` — Search results
- Internal visibility helpers live in `convex/model/{entity}/helpers.ts` as `listPublished*` / `searchPublished*` and are not registered
- `list*`/`get*`/`search*` return data; `*Query` is a file-private unexecuted query builder (e.g. `publishedTalksQuery`); `enrich*`/`filter*`/`normalize*` transform already-fetched data
- Shared exported constants live in `constants.ts`; single-file values stay local

_Mutations:_

- `create*`, `update*`, `archive*` (soft delete), `destroy*` (hard delete)
- `add*To*`, `remove*From*` — Associations
- `favorite*`, `unfavorite*`, `finish*`, `unfinish*` — User actions

### Query & Action Directives

File-level directives for single-function files:

| Directive              | Use Case                   | Location   |
| ---------------------- | -------------------------- | ---------- |
| `'use cache'`          | Public queries (no auth)   | `queries/` |
| `'use cache: private'` | Auth-dependent queries     | `queries/` |
| `'use server'`         | Server Actions (mutations) | `actions/` |

Cached queries include `cacheLife()` and `cacheTag()`.

### Cache Invalidation

Actions use `updateTag()` for read-your-writes. Use `revalidateTag()` for background/webhook invalidation where SWR is preferred. Do not call `refresh()` unless `updateTag` cannot cover the case.

### Error Handling

**Convex Mutations** — `useMutation` from `@/hooks/use-mutation`; map failures with `getErrorMessage`.

**Server Actions** — try/catch and return `mapConvexErrorToFormErrors(error)`.

## React

### No Manual Memoization

React 19's compiler auto-optimizes. Do not use `React.memo()`, `useMemo()`, or `useCallback()`. Write normal functions and components. Only consider memoization for genuinely expensive operations (1000+ items, crypto), and prefer moving those server-side.

### Forward Ref

Use `ref` as a prop, not `React.forwardRef`.

### Types

Import types from `react` (`import type { ReactNode } from 'react'`), not `React.ReactNode` off the default namespace.

### Prop Delegation Naming

When spreading leftover props onto a child, name the rest `delegated`, not `props` or `rest`.

## UI

Project uses Coss UI components built on Base UI.

### Forms

Admin CRUD form actions return `ActionResult`: `requireAdminUser()`, Zod `safeParse` for submitted data, `fetchAuthMutation`, and `updateTag()` for affected caches. On failure, use `setServerErrors(form.setError, result.errors)`. `<FormError error={form.formState.errors.root} />` for form-level errors.

### FieldError with React Hook Form

Always pass `match` on `FieldError` when using React Hook Form. Without it, Base UI only shows native ValidityState errors, so RHF messages never render. Applies to `TextField`, `PasswordField`, `TextareaField`, `SelectField`, `CheckboxField`, `UrlField`, and `NumberField`.

### FieldError Outside Field.Root

`FieldError` requires a `<Field>` ancestor. Outside a natural field (e.g. `FormError`), wrap it in `<Field className="contents">`.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
