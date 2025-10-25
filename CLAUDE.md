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
- `lib/features/` - Business domains (talks, users, clips, speakers, topics, collections)
- `lib/services/` - Infrastructure (auth, email, errors)
- `lib/utils/` - Generic utilities
- `convex/` - Database schema + backend functions
- `convex/model/` - Entity-specific helper functions organized by domain
- `app/` - Next.js App Router pages
- `components/` - Shared UI components

### Data Flow Patterns

**Server Components (default)** - Use for initial data fetch, SEO-critical pages:
```typescript
// app/talks/page.tsx
import { getTalks } from '@/lib/features/talks/queries';

export default async function TalksPage() {
  const talks = await getTalks();
  return <TalksList talks={talks} />;
}
```

**Client Components** - Use for interactivity, real-time updates, React hooks:
```typescript
// app/dashboard/page.tsx
'use client';
import { useTalks } from '@/lib/features/talks/hooks';

export default function Dashboard() {
  const { data: talks, isLoading } = useTalks();
  if (isLoading) return <Loading />;
  return <TalksList talks={talks} />;
}
```

**Hybrid Pattern** - Best of both (server render + client subscribe):
```typescript
// Server component passes initial data to client component
const initialTalks = await getTalks();
return <TalksClient initialData={initialTalks} />;
```

### Convex Backend Organization

**File Structure:**
- `convex/{domain}.ts` - Public API exports (queries, mutations)
- `convex/model/{domain}/` - Entity-specific helpers (queries.ts, mutations.ts, schema.ts, validators.ts)
- `convex/model/auth/` - Authentication helpers (cross-cutting)
- `convex/schema.ts` - Database schema definition
- `convex/http.ts` - HTTP endpoints (webhooks)

**Naming Conventions:**

*Queries (reads):*
- `get` - Returns single document or null (e.g., `get`, `getBySlug`)
- `list` - Returns array of documents (e.g., `list`, `listByAuthor`)

*Mutations (writes):*
- `create` - Create new entity
- `update` - Update existing entity
- `archive` - Soft delete (set status to 'archived')
- `destroy` - Hard delete (permanent removal)
- `remove` - Remove from association/list (non-destructive)
- For user actions with natural verbs: `favorite`, `unfavorite`, `finish`, `unfinish`

**Domain files use simple names** (file provides context):
```typescript
// convex/talks.ts
export const get = query(...)          // api.talks.get
export const getBySlug = query(...)    // api.talks.getBySlug
export const list = query(...)         // api.talks.list
export const create = mutation(...)    // api.talks.create
```

**Helper files include noun** (clarity when imported):
```typescript
// convex/model/talks/queries.ts
export async function getTalk(ctx, id) {...}
export async function getTalkBySlug(ctx, slug) {...}
export async function getTalks(ctx, args) {...}
```

### Feature Structure

Each feature follows a consistent structure:

```
lib/features/{domain}/
├─ hooks/              # Client: React hooks (individual files or single file)
│  ├─ use-talk.ts
│  ├─ use-talks.ts
│  ├─ use-create-talk.ts
│  └─ index.ts         # Barrel export
├─ actions.ts          # Server: Write operations (uses fetchMutation)
├─ queries.ts          # Server: Read operations (uses fetchQuery)
├─ types.ts            # Shared: TypeScript types
├─ utils.ts            # Shared: Pure functions
└─ validation.ts       # Shared: Zod schemas
```

**Hook Organization:**
- Use individual files in `hooks/` directory for features with 8+ hooks or complex logic
- Use single `hooks.ts` file for features with ≤3 simple hooks
- All hooks return `{ data, isLoading, notFound }` pattern (React Query-style)

### Component Organization

**Component Placement:**
- `components/` - Shared components used across multiple pages
- `app/{page}/_components/` - Page-specific components (prefix with `_`)
- `lib/features/{domain}/components/` - Feature-specific components

**Component Structure:**
```
components/component-name/
├─ component-name.tsx
├─ component-name.types.ts
├─ component-name.test.tsx
└─ index.ts                    # Barrel export
```

**Naming:** Use kebab-case for all folders and files

### Authentication

**Better Auth** is used with Convex integration:
- Client: `import { useSession } from '@/lib/services/auth/client'`
- Server: `import { getServerSession } from '@/lib/services/auth/server'`
- Convex: `import { getCurrentUser } from '@/convex/model/auth'`

### Error Handling

**For Convex Mutations** - Always use custom hook:
```typescript
import { useMutation } from '@/lib/hooks'; // NOT from 'convex/react'
import { api } from '@/convex/_generated/api';

const { mutate, isLoading, error } = useMutation(api.talks.create, {
  onSuccess: () => toast.success('Created!'),
  onError: (error) => toast.error(getErrorMessage(error)),
});
```

**For Component Errors** - Wrap with ErrorBoundary:
```typescript
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <ComponentWithQueries />
</ErrorBoundary>
```

**Manual Error Handling:**
```typescript
import { captureException, getErrorMessage } from '@/lib/services/errors';

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

1. **Always wrap Convex calls** - Never call `useQuery(api.talks.list)` directly in components. Create custom hooks in `lib/features/{domain}/hooks/`

2. **Organize by domain, not layer** - Related code lives together in features, not scattered across `hooks/`, `queries/`, `actions/` directories

3. **Server Components by default** - Only use Client Components when you need interactivity, hooks, or browser APIs

4. **Type safety** - Convex provides end-to-end type safety from database to frontend

5. **Co-located code** - Tests, types, and utils live next to the components/features they support

6. **Minimal cross-feature dependencies** - Features should be self-contained. Shared logic goes in `lib/services/` or `lib/utils/`

7. **Consistent naming** - Follow the established patterns for queries (`get`/`list`), mutations (action verbs), and hooks (`use` + mirror backend names)
