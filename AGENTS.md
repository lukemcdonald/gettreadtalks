# Agent Instructions

Greenfield project — no users, no back-compat concerns. Make it right.

## Workflow

- Package manager: **pnpm**
- Before marking any task complete: run `pnpm style` and `pnpm typecheck`
- After meaningful TypeScript or JavaScript changes, run `pnpm run audit:code`
- Never run `pnpm dev` unless instructed
- When testing local URLs, always use `https`

Use the Fallow skill for deeper audit and debug workflows.

## Conventions

- No emojis anywhere: code, commits, descriptions, PR titles
- Alphabetize: imports, object keys, destructured props, component prop lists
  - Exception: group related items together if alphabetical order hurts readability

## Code Comments

JSDoc only when adding context beyond the function name (1–2 lines max). Skip `@param`/`@returns` unless documenting non-obvious constraints, defaults, or side effects. Never: commented-out code, obvious comments, redundant type docs.

## Linear

Always use the **gettreadtalks.com** project (`441dc110-d73c-46cb-b395-1c762d7e2958`) when searching, creating, or updating Linear issues for this codebase.

## Rules

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
- `src/lib/` - Cross-cutting concerns (forms, entities)
- `src/services/` - Infrastructure (auth, email, errors)
- `src/utils/` - Generic utilities

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

**UI Primitives:** Files in `src/components/ui/primitives/` are vendor components — never edit directly. Create wrappers in `src/components/ui/`.

**UI imports** — always import from `@/components/ui`, never from primitive paths directly:

```typescript
// ✅ Always use the barrel
import { Button, Card, TextField } from '@/components/ui';

// ❌ Never import primitives directly in feature/page code
import { Button } from '@/components/ui/primitives/button';
```

**Overlays**

- Dialog — centered blocking UI (confirm, alert)
- Sheet — side/bottom panel that is a form or other controlled edit (FormSheet)
- Drawer — edge panel where swipe-to-dismiss is the product (nav, mobile filters)
- Never edit `src/components/ui/primitives/*`

**Naming:** kebab-case for all `src/` folders

### Layout Data Fetching

Never fetch data in `layout.tsx` on the server. Doing so forces all children into dynamic rendering, breaking static rendering for the entire subtree.

```tsx
// ❌ Never — makes all children dynamic
export default async function Layout({ children }) {
  const data = await fetchSomeData();
  return <Sidebar data={data}>{children}</Sidebar>;
}

// ✅ Fetch inside the component, not the layout
export default function Layout({ children }) {
  return <Sidebar>{children}</Sidebar>; // Sidebar fetches its own data internally
}
```

**Exception:** Auth guards (`requireCurrentUser`, `requireAdminUser`) are acceptable in layouts — they redirect rather than pass data to children, and protected routes are inherently dynamic.

## Convex

### File Structure

- `convex/{domain}.ts` - Public API exports
- `convex/model/{domain}/` - Entity helpers (queries.ts, mutations.ts, schema.ts, validators.ts)
- `convex/model/auth/` - Authentication helpers
- `convex/lib/` - Shared utilities

## File Naming

Convex only allows alphanumeric characters, underscores, and periods in file/folder names. Kebab-case is not supported and will cause deployment errors.

- Multi-word files/folders: **camelCase** (e.g., `affiliateLinks.ts`, `betterAuth/`, `rotateContent.ts`)
- Single-word files: lowercase (e.g., `filters.ts`, `sort.ts`, `utils.ts`)

### Naming Conventions

_Queries:_

- `get*` — Single document or null
- `list*` — Filtered/public array with enrichment
- `listAll*` — Unfiltered array for admin

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

Cached queries include `cacheLife()` and `cacheTag()` for invalidation:

```typescript
'use cache: private';
// imports...

export async function getEntity(id: EntityId) {
  cacheLife('hours');
  cacheTag('entities');
  // ...
}
```

### Cache Invalidation

Actions use `updateTag` for read-your-writes semantics (user sees their change immediately):

```typescript
import { updateTag } from 'next/cache';

updateTag('entities');
```

Use `revalidateTag()` for background/webhook invalidation where SWR behavior is preferred.

### Error Handling

**Convex Mutations** — Use custom hook:

```typescript
import { useMutation } from '@/hooks';

const { mutate, isLoading, error } = useMutation(api.talks.createTalk, {
  onSuccess: () => toast.success('Created!'),
  onError: (error) => toast.error(getErrorMessage(error)),
});
```

**Server Actions** — Try/catch with error mapping:

```typescript
import { mapConvexErrorToFormErrors } from '@/lib/forms/validation';

try {
  const result = await fetchAuthMutation(api.talks.createTalk, data);
  return { success: true, data: result };
} catch (error) {
  return { success: false, errors: mapConvexErrorToFormErrors(error) };
}
```

## React

### No Manual Memoization

React 19's compiler auto-optimizes. **Do not use:**

- `React.memo()`
- `useMemo()`
- `useCallback()`

Write normal functions and components. Only consider memoization for genuinely expensive operations (1000+ items, crypto), and prefer moving those server-side.

### Forward Ref

Use `ref` as a prop, not `React.forwardRef`.

### Types

Explicitly import types from React instead of importing off global React.

```ts
✅ import type { ReactNode } from 'react';
type ExampleProps = { children: ReactNode };

❌ import * from 'react'
type ExampleProps = { children: React.ReactNode };
```

### Prop Delegation Naming

When spreading props onto a child element, use `delegated` instead of `props` or `rest`:

```ts
// ✅ Good
function Link({ href, target, ...delegated }: LinkProps) {
  return <NextLink href={href} target={target} {...delegated} />;
}

// ❌ Bad
function Link({ href, target, ...props }: LinkProps) {
  return <NextLink href={href} target={target} {...props} />;
}
```

## UI

Project uses Coss UI components that are built on top of Base UI component library.

### FieldError with React Hook Form

Always pass `match` prop to `FieldError` when using React Hook Form validation.

Without `match`, Base UI's `FieldError` only renders when native HTML5 `ValidityState` fails (e.g., empty `required` field). RHF validation errors won't show even though the red border appears via `aria-invalid`.

**`match={true}`** tells Base UI that an external library controls visibility — the component renders whenever it's mounted, so conditional rendering via `{!!fieldState.error && ...}` works as expected.

```tsx
// ✅ Correct — error message renders when fieldState.error is set
<>
  {!!fieldState.error && (
    <FieldError match>{fieldState.error?.message}</FieldError>
  )}
</>

// ❌ Wrong — error message never renders (native ValidityState is valid)
<>
  {!!fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}
</>
```

This applies to all field components: `TextField`, `PasswordField`, `TextareaField`, `SelectField`, `CheckboxField`, `UrlField`, `NumberField`.

### FieldError Outside Field.Root

`FieldError` (Base UI's `FieldPrimitive.Error`) requires a `<Field.Root>` ancestor. It calls `useFieldRootContext(false)` which throws "FieldRootContext is missing" if no context is present.

When `FieldError` must be used outside a natural `<Field.Root>` (e.g., in `FormError`), wrap it in a `<Field className="contents">`. The `contents` class removes the wrapper div from layout while still providing the React context:

```tsx
// ✅ Correct — Field provides context, contents removes it from layout
<Field className="contents" invalid>
  <FieldError match>{message}</FieldError>
</Field>

// ❌ Wrong — throws "FieldRootContext is missing"
<FieldError>{message}</FieldError>
```

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
