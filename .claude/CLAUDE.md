# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

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

This project uses **Ultracite** (Biome-based) for linting and formatting. Run `pnpm style` before committing.

**What Biome handles:** formatting, import ordering, unused variables, type safety, accessibility violations.

**What requires judgment:** business logic, meaningful naming, architecture, edge cases, UX.

### React 19+ Patterns
- Use `ref` as a prop instead of `React.forwardRef`
- No unnecessary memoization - React 19 optimizes automatically

## Architecture

### Feature-Based Organization

Code is organized by **domain/feature**, not technical layer.

**Directory Structure:**
- `src/features/` - Business domains (talks, users, clips, speakers, topics, collections)
- `src/services/` - Infrastructure (auth, email, errors)
- `src/lib/` - Cross-cutting concerns (forms, entities)
- `src/utils/` - Generic utilities
- `src/constants/` - Shared constants
- `convex/` - Database schema + backend functions
- `convex/model/` - Entity-specific helpers organized by domain
- `src/app/` - Next.js App Router pages
- `src/components/` - Shared UI components

**Path Alias:** `@/*` maps to `src/*`

### Data Flow Patterns

**Server Components (default)** - Fetch data server-side:
```typescript
import { getTalks } from '@/features/talks';

export default async function TalksPage({ searchParams }) {
  const params = await searchParams;
  const { talks } = await getTalks({ search: params.search });
  return <TalksList talks={talks} />;
}
```

**Client Components** - Only for interactivity, forms, and mutations:
```typescript
'use client';
import { useTalkForm } from '@/features/talks/hooks';

export function TalkFormClient({ speakers, collections }) {
  const { form, onSubmit, isBusy } = useTalkForm({ speakers, collections });
  return <form onSubmit={onSubmit}>...</form>;
}
```

### Convex Backend Organization

**File Structure:**
- `convex/{domain}.ts` - Public API exports
- `convex/model/{domain}/` - Entity helpers (queries.ts, mutations.ts, schema.ts, validators.ts)
- `convex/model/auth/` - Authentication helpers
- `convex/lib/` - Shared utilities

**Naming Conventions:**

*Queries:*
- `get*` - Single document or null
- `list*` - Filtered/public array with enrichment
- `listAll*` - Unfiltered array for admin

*Mutations:*
- `create*`, `update*`, `archive*` (soft delete), `destroy*` (hard delete)
- `add*To*`, `remove*From*` - Associations
- `favorite*`, `unfavorite*`, `finish*`, `unfinish*` - User actions

### Feature Structure

```
src/features/{domain}/
├─ actions/            # Server actions (writes)
├─ queries/            # Server queries (reads)
├─ hooks/              # Client hooks (mutations/forms only)
├─ components/         # Feature-specific components
├─ schemas/            # Zod validation
├─ types.ts
├─ utils.ts
└─ index.ts            # Public barrel export
```

### Component Organization

1. **Shared** - `src/components/` - Used across features
2. **Feature** - `src/features/{domain}/components/` - Feature-specific
3. **Route** - `src/app/{route}/_components/` - Route-specific

**UI Primitives:** Files in `src/components/ui/primitives/` are vendor components - never edit directly. Create wrappers in `src/components/ui/`.

**Naming:** kebab-case for all folders and files

### Route-Level Co-location

Route groups can co-locate `_hooks/`, `_queries/`, and `_components/` for code shared across pages within that group but not specific to a feature domain. Feature-specific code stays in `src/features/{domain}/`.

### Authentication

Better Auth with Convex integration:
- Client: `import { useCurrentUser } from '@/features/users/hooks'`
- Server: `import { getCurrentUser, requireAdminUser, getAuthToken } from '@/services/auth/server'`
- Convex: `import { getCurrentUser, requireAuth } from '@/convex/model/auth'`

### Cache Invalidation

Admin actions use `updateTag` for read-your-writes semantics (user sees their change immediately):
```typescript
import { updateTag } from 'next/cache';

updateTag('talks');        // Invalidate talks cache
updateTag('form-options'); // Invalidate form options cache
```

Use `revalidateTag(tag, profile)` for background/webhook invalidation where SWR behavior is preferred.

### Error Handling

**Convex Mutations** - Use custom hook:
```typescript
import { useMutation } from '@/hooks';

const { mutate, isLoading, error } = useMutation(api.talks.createTalk, {
  onSuccess: () => toast.success('Created!'),
  onError: (error) => toast.error(getErrorMessage(error)),
});
```

**Server Actions** - Try/catch with error mapping:
```typescript
import { mapConvexErrorToFormErrors } from '@/lib/forms/validation';

try {
  const result = await fetchAuthMutation(api.talks.createTalk, data);
  return { success: true, data: result };
} catch (error) {
  return { success: false, errors: mapConvexErrorToFormErrors(error) };
}
```

## Key Principles

1. **Server-first data fetching** - Fetch in server components, pass to client
2. **Organize by domain** - Related code lives together in features
3. **Server Components by default** - Client only for interactivity
4. **Type safety** - Convex provides end-to-end types
5. **Co-located code** - Tests, types, utils next to their components
6. **Minimal cross-feature dependencies** - Shared logic in `src/services/` or `src/lib/`
7. **Consistent naming** - Follow established patterns
8. **Filter/sort server-side** - Not in client-side hooks
