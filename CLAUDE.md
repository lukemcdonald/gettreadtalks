# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TREAD Talks is a modern, full-stack faith-based talks and content platform built with Next.js 16, React 19, Convex (backend + database), and Better Auth. The application uses Tailwind CSS v4 for styling and is deployed on Vercel.

## Development Commands

### Starting Development
```bash
pnpm dev                    # Runs Next.js + Convex dev servers in parallel + opens browser
pnpm dev:frontend           # Run only Next.js dev server
pnpm dev:backend            # Run only Convex dev server
```

### Code Quality
```bash
pnpm typecheck              # Run TypeScript type checking (tsc --noEmit)
pnpm lint                   # Run Biome linter
pnpm lint:fix               # Fix linting issues automatically
pnpm format                 # Check code formatting
pnpm format:fix             # Fix formatting issues
pnpm check                  # Run all Biome checks (lint + format)
pnpm style                  # Format and lint with --write flag
```

### Building and Deployment
```bash
pnpm build                  # Deploy Convex functions + build Next.js (production)
pnpm build:next             # Build only Next.js app
pnpm start                  # Start production Next.js server
pnpm push                   # Deploy Convex functions to production
```

### Database Seeding
```bash
pnpm seed                   # Seed database with sample data
pnpm seed:force             # Force re-seed (clears existing data)
```

### Testing Individual Files
- Type checking: `pnpm typecheck` (checks all files)
- Linting: `pnpm biome lint path/to/file.ts`
- Formatting: `pnpm biome format path/to/file.ts`

## Architecture

### Feature-Based Organization

Code is organized by **domain/feature**, not technical layer. Each feature contains all its client, server, and shared code together.

**Directory Structure:**
- `src/features/` - Business domains (talks, users, clips, speakers, topics, collections)
- `src/services/` - Infrastructure (auth, email, errors)
- `src/lib/` - Cross-cutting concerns (forms, entities)
- `src/utils/` - Generic utilities
- `src/constants/` - Shared constants
- `convex/` - Database schema + backend functions
- `convex/model/` - Entity-specific helper functions organized by domain
- `src/app/` - Next.js App Router pages
- `src/components/` - Shared UI components

**Path Alias:** `@/*` maps to `src/*`

### Data Flow Patterns

**Server Components (default)** - Fetch data server-side, no hooks needed:
```typescript
// src/app/talks/page.tsx
import { getTalks } from '@/features/talks';

export default async function TalksPage({ searchParams }) {
  const params = await searchParams;
  const { talks } = await getTalks({ search: params.search, sort: params.sort });
  return <TalksList talks={talks} />;
}
```

**Client Components** - Use only for interactivity, forms, and mutations:
```typescript
// src/app/talks/new/page.tsx
'use client';
import { useTalkForm } from '@/features/talks/hooks';

export function TalkFormClient({ speakers, collections }) {
  const { form, onSubmit, isBusy } = useTalkForm({ speakers, collections });
  return <form onSubmit={onSubmit}>...</form>;
}
```

**Important:** Data fetching happens server-side. Client hooks are for mutations only, not queries.

### Convex Backend Organization

**File Structure:**
- `convex/{domain}.ts` - Public API exports (queries, mutations)
- `convex/model/{domain}/` - Entity-specific helpers (queries.ts, mutations.ts, schema.ts, validators.ts)
- `convex/model/auth/` - Authentication helpers (cross-cutting)
- `convex/lib/` - Shared utilities (filters, sort, utils)
- `convex/schema.ts` - Database schema definition
- `convex/http.ts` - HTTP endpoints (webhooks)

**Naming Conventions:**

*Queries (reads) - Safe-by-default pattern:*
- `get*` - Returns single document or null (e.g., `getTalk`, `getTalkBySlug`)
- `list*` - Returns filtered/public array with data enrichment (e.g., `listTalks`, `listSpeakers`)
- `listAll*` - Returns unfiltered array for admin use (e.g., `listAllTalks`, `listAllSpeakers`)

*Mutations (writes):*
- `create*` - Create new entity (e.g., `createTalk`)
- `update*` - Update existing entity (e.g., `updateTalk`)
- `archive*` - Soft delete (set status to 'archived')
- `destroy*` - Hard delete (permanent removal)
- `remove*From*` - Remove from association (e.g., `removeTalkFromTopic`)
- `add*To*` - Add to association (e.g., `addTalkToTopic`)
- For user actions with natural verbs: `favorite*`, `unfavorite*`, `finish*`, `unfinish*`

**Domain files use full descriptive names** (clarity and discoverability):
```typescript
// convex/talks.ts
export const getTalk = queries.getTalk;           // api.talks.getTalk
export const getTalkBySlug = queries.getTalkBySlug; // Returns relations (detail pages)
export const listTalks = queries.listTalks;       // Filtered/public with enrichment
export const listAllTalks = queries.listAllTalks; // Unfiltered/admin
export const createTalk = mutations.createTalk;   // api.talks.createTalk
```

### Feature Structure

Each feature follows a consistent structure with subdirectories:

```
src/features/{domain}/
├─ actions/            # Server actions (write operations)
│  ├─ index.ts         # Barrel export
│  ├─ create-talk.ts   # Individual action files
│  └─ update-talk.ts
├─ queries/            # Server queries (read operations)
│  ├─ index.ts         # Barrel export
│  ├─ get-talk.ts      # Individual query files
│  └─ get-talks.ts
├─ hooks/              # Client hooks (mutations/forms only)
│  ├─ index.ts         # Barrel export
│  ├─ use-talk-form.ts # Form hooks
│  └─ use-archive-talk.ts # Mutation hooks
├─ components/         # Feature-specific components
│  ├─ index.ts
│  └─ talk-card.tsx
├─ schemas/            # Zod validation schemas
│  └─ talk-form.ts
├─ types.ts            # TypeScript types
├─ utils.ts            # Pure functions
└─ index.ts            # Public barrel export
```

**Server Functions Pattern:**
```typescript
// src/features/talks/queries/get-talks.ts
'use server';

import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTalks(args?: GetTalksProps) {
  const token = await getAuthToken();
  const result = await fetchQuery(api.talks.listTalks, { ... }, { token });
  return { talks: result.page };
}
```

**Hook Organization:**
- Hooks are for **mutations and forms only**, not data fetching
- Data fetching happens server-side in page components
- Use `useMutation` from `@/hooks` for Convex mutations
- Form hooks manage form state and submission

### Component Organization

**Three Component Locations:**

1. **Shared components** - `src/components/`
   - Used across multiple pages/features
   - Examples: `grid-list`, `page-header`, `layouts/`

2. **Feature components** - `src/features/{domain}/components/`
   - Used by a specific feature
   - Examples: `talk-card`, `speaker-avatar`

3. **Page-specific components** - `src/app/{route}/_components/`
   - Used only by that route
   - Examples: `talks-sidebar`, `speakers-list`

**⚠️ UI Primitives - Do Not Modify:**
Files in `src/components/ui/primitives/` are vendor components and must NEVER be edited directly. These are base UI components that the rest of the application builds upon. If you need to customize behavior:
- Create a wrapper component in `src/components/ui/`
- Extend via composition, not modification
- Report issues upstream if the primitive needs fixing

**Naming:** Use kebab-case for all folders and files

### Authentication

**Better Auth** is used with Convex integration:
- Client: `import { useCurrentUser } from '@/features/users/hooks'`
- Server: `import { getCurrentUser, requireAdminUser, getAuthToken } from '@/services/auth/server'`
- Convex: `import { getCurrentUser, requireAuth } from '@/convex/model/auth'`

### Error Handling

**For Convex Mutations** - Always use custom hook:
```typescript
import { useMutation } from '@/hooks';
import { api } from '@/convex/_generated/api';

const { mutate, isLoading, error } = useMutation(api.talks.createTalk, {
  onSuccess: () => toast.success('Created!'),
  onError: (error) => toast.error(getErrorMessage(error)),
});
```

**For Server Actions** - Use try/catch with error mapping:
```typescript
import { mapConvexErrorToFormErrors } from '@/lib/forms/validation';

try {
  const result = await fetchAuthMutation(api.talks.createTalk, data);
  return { success: true, data: result };
} catch (error) {
  return { success: false, errors: mapConvexErrorToFormErrors(error) };
}
```

**Manual Error Handling:**
```typescript
import { captureException, getErrorMessage } from '@/services/errors';

try {
  await riskyOperation();
} catch (error) {
  captureException(error, { context: { operation: 'riskyOperation' } });
  toast.error(getErrorMessage(error));
}
```

### Database Schema

The database uses Convex with the following domain tables:
- `talks` - Main content (video talks)
- `clips` - Short video clips extracted from talks
- `speakers` - People who give talks
- `topics` - Categorical topics
- `collections` - Curated collections of talks
- `affiliateLinks` - Amazon affiliate links for talks

**Join Tables:**
- `clipsOnTopics` - Many-to-many: clips ↔ topics
- `talksOnTopics` - Many-to-many: talks ↔ topics
- `userFavoriteClips` - User favorites for clips
- `userFavoriteSpeakers` - User favorites for speakers
- `userFavoriteTalks` - User favorites for talks
- `userFinishedTalks` - Talks marked as completed by users

## Configuration

### Environment Variables

**Vercel (Deployment):**
- `CONVEX_DEPLOY_KEY` - From Convex Dashboard → Settings → Deploy Keys

**Convex Dashboard (Development & Production):**
- `BETTER_AUTH_SECRET` - Random secret for Better Auth
- `SITE_URL` - Production URL
- `RESEND_API_KEY` - Email service API key
- `RESEND_FROM_EMAIL` - Sender email (defaults to `delivered@resend.dev`)
- `RESEND_TEST_MODE` - Set to `false` to send real emails
- `RESEND_WEBHOOK_SECRET` - From Resend Dashboard

### Next.js Configuration

- **Next.js 16** with Cache Components enabled (`cacheComponents: true`)
- **CSP Headers** configured for security
- **Sentry** integration for error tracking (conditionally enabled)
- **Tailwind CSS v4** for styling

## Key Principles

1. **Server-first data fetching** - Fetch data in server components, pass to client components. No client-side data fetching hooks for main features.

2. **Organize by domain, not layer** - Related code lives together in features, not scattered across `hooks/`, `queries/`, `actions/` directories

3. **Server Components by default** - Only use Client Components when you need interactivity, forms, or browser APIs

4. **Type safety** - Convex provides end-to-end type safety from database to frontend

5. **Co-located code** - Tests, types, and utils live next to the components/features they support

6. **Minimal cross-feature dependencies** - Features should be self-contained. Shared logic goes in `src/services/` or `src/lib/`

7. **Consistent naming** - Follow the established patterns for queries (`get*`/`list*` for public, `listAll*` for admin), mutations (action verbs with nouns), and hooks (`use` + action name)

8. **Never edit UI primitives** - Files in `src/components/ui/primitives/` are vendor components and must never be modified. Create wrappers in `src/components/ui/` instead

9. **No unnecessary memoization** - React 19 handles optimization automatically. Avoid `memo()`, `useCallback()`, `useMemo()` unless profiling shows a specific need

10. **Filter/sort server-side** - Move filtering and sorting logic to server components or Convex queries, not client-side hooks
