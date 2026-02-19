# Convex

## File Structure

- `convex/{domain}.ts` - Public API exports
- `convex/model/{domain}/` - Entity helpers (queries.ts, mutations.ts, schema.ts, validators.ts)
- `convex/model/auth/` - Authentication helpers
- `convex/lib/` - Shared utilities

## File Naming

Convex enforces strict file naming — only alphanumeric characters, underscores, or periods allowed.

- Multi-word files/folders: **camelCase** (e.g., `affiliateLinks.ts`, `betterAuth/`, `rotateContent.ts`)
- Single-word files: lowercase (e.g., `filters.ts`, `sort.ts`, `utils.ts`)
- **Never use kebab-case/hyphens** — will cause deployment errors

## Naming Conventions

*Queries:*

- `get*` — Single document or null
- `list*` — Filtered/public array with enrichment
- `listAll*` — Unfiltered array for admin

*Mutations:*

- `create*`, `update*`, `archive*` (soft delete), `destroy*` (hard delete)
- `add*To*`, `remove*From*` — Associations
- `favorite*`, `unfavorite*`, `finish*`, `unfinish*` — User actions

## Query & Action Directives

File-level directives for single-function files:

| Directive | Use Case | Location |
| --------- | -------- | -------- |
| `'use cache'` | Public queries (no auth) | `queries/` |
| `'use cache: private'` | Auth-dependent queries | `queries/` |
| `'use server'` | Server Actions (mutations) | `actions/` |

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

## Cache Invalidation

Actions use `updateTag` for read-your-writes semantics (user sees their change immediately):

```typescript
import { updateTag } from 'next/cache';

updateTag('entities'); // Invalidate after mutation
```

Use `revalidateTag()` for background/webhook invalidation where SWR behavior is preferred.

## Error Handling

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
