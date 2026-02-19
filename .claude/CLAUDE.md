# CLAUDE.md

TREAD Talks is a full-stack faith-based talks platform built with Next.js 16, React 19, Convex (backend + database), and Better Auth. Uses Tailwind CSS v4, deployed on Vercel.

## Development Commands

```bash
# Development
pnpm dev                    # Next.js + Convex dev servers + opens browser
pnpm dev:frontend           # Next.js only
pnpm dev:backend            # Convex only

# Code Quality
pnpm typecheck              # TypeScript checking (tsc --noEmit)
pnpm style                  # Format and lint with --write flag
pnpm check                  # All Biome checks (lint + format)

# Build & Deploy
pnpm build                  # Deploy Convex + build Next.js (production)
pnpm push                   # Deploy Convex functions to production

# Database
pnpm seed                   # Seed with sample data
pnpm seed:force             # Force re-seed (clears existing)
```

## Code Quality

**Ultracite** (Biome-based) handles formatting, import ordering, unused variables, type safety, and accessibility. Run `pnpm style` before committing.

See [comments & style rules](rules/comments.md).

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

### Data Flow Patterns

**Server Components (default)** — Fetch data server-side:

```typescript
import { getTalks } from '@/features/talks/queries/get-talks';

export default async function TalksPage({ searchParams }) {
  const params = await searchParams;
  const { talks } = await getTalks({ search: params.search });
  return <TalksList talks={talks} />;
}
```

**Client Components** — Only for interactivity, forms, and mutations:

```typescript
'use client';
import { useTalkForm } from '@/features/talks/hooks';

export function TalkFormClient({ collections, speakers }) {
  const { form, isBusy, onSubmit } = useTalkForm({ collections, speakers });
  return <form onSubmit={onSubmit}>...</form>;
}
```

### Feature Structure

```sh
src/features/{domain}/
├─ actions/            # Server actions (writes)
├─ components/         # Feature-specific components
├─ hooks/              # Client hooks (mutations/forms only)
├─ queries/            # Server queries (reads)
├─ schemas/            # Zod validations
├─ types.ts
└─ utils.ts
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

**Naming:** kebab-case for all folders

### Route-Level Co-location

Route groups can co-locate `_components/`, `_hooks/`, and `_queries/` for code shared across pages within that group but not specific to a feature domain. Feature-specific code stays in `src/features/{domain}/`.

### Authentication

Better Auth with Convex integration:

- Client: `import { useCurrentUser } from '@/features/users/hooks'`
- Server: `import { getCurrentUser, requireAdminUser, getAuthToken } from '@/services/auth/server'`
- Convex: `import { getCurrentUser, requireAuth } from '@/convex/model/auth'`

**Derived auth hooks** — prefer derived hooks over reading raw user fields:

```typescript
// ✅ Component only needs admin check
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';

// ✅ Component only needs auth state
import { useIsAuthenticated } from '@/features/users/hooks/use-is-authenticated';

// ✅ Component needs user data (email, name, etc.)
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
```

## Key Principles

1. **Server-first data fetching** — Fetch in server components, pass to client
2. **Organize by domain** — Related code lives together in `src/features/`
3. **Server Components by default** — Client only for interactivity
4. **Type safety** — Convex provides end-to-end types
5. **Co-located code** — Tests, types, utils next to their components
6. **Minimal cross-feature dependencies** — Shared logic in `src/services/` or `src/lib/`
7. **Consistent naming** — Follow established patterns
8. **Filter/sort server-side** — Not in client-side hooks

## Rules

- [React patterns](rules/react.md) — Memoization, ref, types, prop delegation
- [Convex patterns](rules/convex.md) — File naming, query/mutation conventions, caching, error handling
- [Base UI patterns](rules/base-ui.md) — FieldError with RHF, context requirements
- [Comments & style](rules/comments.md) — JSDoc, alphabetization
