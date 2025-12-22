# Feature Structure Architecture

## Overview

Features follow a consistent structure that separates concerns and provides clear organization for domain entities.

## Directory Structure

```sh
src/features/{feature}/
├─ actions/          # Server Actions (when 2+ actions)
│  ├─ index.ts       # Barrel export
│  ├─ create-*.ts    # Individual action files (schema co-located if action-specific)
│  └─ update-*.ts    # Individual action files
├─ actions.ts        # Single Server Action (when 1 action only)
├─ server.ts         # Server queries (read operations)
├─ schemas/          # Shared Zod validation schemas (when used by multiple actions)
│  └─ *-form.ts      # Shared form schemas
├─ hooks/            # React hooks (when 3+ hooks)
│  ├─ index.ts       # Barrel export
│  └─ use-*.ts       # Individual hook files
├─ types.ts          # TypeScript types
├─ utils.ts          # Pure utility functions (optional)
└─ index.ts          # Barrel export
```

## File Purposes

### `server.ts` - Read Operations

**Purpose:** Server-side read operations (queries)

**Contains:**
- Functions that use `fetchQuery` to read data
- Functions called from Server Components
- Functions that return data for initial page loads

**Pattern:**
```ts
'use server';

import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getItems({ limit }: { limit?: number } = {}) {
  const token = await getAuthToken();
  const result = await fetchQuery(api.items.listItems, { limit }, { token });
  return { items: result.page, continueCursor: result.continueCursor };
}
```

**When to use:**
- ✅ Fetching data for Server Components
- ✅ Initial page load data
- ✅ SEO-critical content
- ❌ Form submissions (use `actions.ts`)
- ❌ Mutations (use `actions.ts`)

### `actions/` - Write Operations (Form Submissions)

**Purpose:** Server Actions for form submissions with validation

**Structure:** Use folder when 2+ actions, single file when 1 action

**Contains:**
- Functions that use `fetchMutation` to write data
- Form validation with Zod schemas (co-located when action-specific)
- Authorization checks
- Error mapping for forms

**Pattern (Individual Action File):**
```ts
'use server';
import 'server-only';

import type { ActionResult } from '@/lib/forms/types';

import { fetchMutation } from 'convex/nextjs';
import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { withConvexAuth } from '@/lib/convex/server-action';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { requireAdminUser } from '@/services/auth/server';

// Schema co-located with action (when action-specific)
const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
});

type CreateItemData = z.infer<typeof createItemSchema>;

export async function createItemAction(
  data: unknown,
): Promise<ActionResult<{ itemId: string }>> {
  await requireAdminUser();
  
  const parsed = createItemSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: mapZodErrors(parsed.error) };
  }

  try {
    const itemId = await withConvexAuth(
      async (token) => await fetchMutation(api.items.createItem, parsed.data, { token }),
    );
    return { success: true, data: { itemId } };
  } catch (error) {
    return { success: false, errors: mapConvexErrorToFormErrors(error) };
  }
}
```

**When to use folder:**
- ✅ Feature has 2+ actions
- ✅ Actions have different schemas
- ✅ Team development (avoids merge conflicts)
- ✅ Better organization for complex features

**When to use single file:**
- ✅ Feature has 1 action
- ✅ Action is simple

**Schema Location:**
- ✅ **Action-specific schema** → Co-locate in action file
- ✅ **Shared schema** (used by multiple actions) → Keep in `schemas/` folder

### `schemas/` - Shared Validation Schemas

**Purpose:** Zod schemas shared across multiple actions

**Structure:**
```sh
schemas/
└─ *-form.ts        # Shared form schemas (used by create + update)
```

**Pattern:**
```ts
import { z } from 'zod';

export const itemFormSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;
```

**When to use `schemas/` folder:**
- ✅ Schema is used by multiple actions (e.g., create + update)
- ✅ Schema is shared across features
- ✅ Complex validation rules that benefit from separation

**When to co-locate with action:**
- ✅ Schema is only used by one action
- ✅ Action-specific validation rules
- ✅ Simpler organization (schema right next to action)

### `types.ts` - TypeScript Types

**Purpose:** TypeScript type definitions for the feature

**Contains:**
- Entity types (e.g., `Item`, `ItemId`)
- Feature-specific types
- Type exports from Convex

**Pattern:**
```ts
import type { Doc, Id } from '@/convex/_generated/dataModel';

export type Item = Doc<'items'>;
export type ItemId = Id<'items'>;
```

**When to add:**
- ✅ Entity types
- ✅ Feature-specific types
- ✅ Types used across the feature
- ❌ Shared types (use `lib/` or `@/lib/forms/types`)

### `hooks/` - React Hooks

**Purpose:** Client-side React hooks for data fetching and mutations

**Structure:** Use folder when 3+ hooks, single file when 1-2 hooks

**Pattern:**
```ts
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useItems(limit?: number) {
  const data = useQuery(api.items.listItems, { limit });
  return { data: data ?? [], isLoading: data === undefined };
}
```

**When to use folder:**
- ✅ Feature has 3+ hooks
- ✅ Hooks have complex logic
- ✅ Team development (avoids merge conflicts)

**When to use single file:**
- ✅ Feature has 1-2 simple hooks
- ✅ Hooks are trivial pass-throughs

## Decision Tree: `server.ts` vs `actions/`

```
Does it write data (mutation)?
├─ No → Use server.ts
│   └─ Uses fetchQuery
│
└─ Yes → Does it need form validation?
    ├─ No → Use server.ts (simple mutation)
    │   └─ Example: updatePassword, simple toggles
    │
    └─ Yes → Use actions/ (or actions.ts if single action)
        ├─ 1 action → actions.ts
        └─ 2+ actions → actions/ folder
            └─ Uses fetchMutation + validation + error mapping
```

## Decision Tree: Schema Location

```
Is schema used by multiple actions?
├─ Yes → Use schemas/ folder
│   └─ Example: itemFormSchema used by create + update
│
└─ No → Co-locate with action
    └─ Example: createSpeakerSchema only used by createSpeakerAction
```

## Shared Types

### `ActionResult<T>`

**Location:** `src/lib/forms/types.ts`

**Purpose:** Shared return type for all Server Actions that handle form submissions

**Usage:**
```ts
import type { ActionResult } from '@/lib/forms/types';

export async function createItemAction(
  data: unknown,
): Promise<ActionResult<{ itemId: string }>> {
  // ...
}
```

**Why shared:**
- ✅ Consistent return type across all form actions
- ✅ Single source of truth
- ✅ Easy to update if pattern changes

## Examples

### Feature with Full Structure

```sh
src/features/items/
├─ actions/                # Server Actions folder (2+ actions)
│  ├─ index.ts             # Barrel export
│  ├─ create-item.ts       # createItemAction + createItemSchema (co-located)
│  └─ update-item.ts       # updateItemAction (uses shared schema from schemas/)
├─ server.ts               # getItems, getItemBySlug
├─ schemas/                # Shared schemas only
│  └─ item-form.ts         # itemFormSchema (used by create + update)
├─ hooks/
│  ├─ index.ts             # Barrel export
│  ├─ use-item.ts          # Single item query
│  ├─ use-items.ts         # List query
│  └─ use-create-item.ts   # Mutation hook
├─ types.ts                # Item, ItemId types
└─ index.ts                # Barrel export
```

### Feature with Minimal Structure

```sh
src/features/simple/
├─ server.ts               # getSimpleData
├─ types.ts                # Simple type
└─ index.ts                # Barrel export
```

## Best Practices

1. **Always separate reads and writes**
   - `server.ts` for reads
   - `actions.ts` for form submissions

2. **Use shared types**
   - `ActionResult<T>` from `@/lib/forms/types`
   - Feature-specific types in `types.ts`

3. **Organize schemas**
   - Use `schemas/` folder for multiple schemas
   - Name schemas by purpose: `create-*.ts`, `update-*.ts`, `*-form.ts`

4. **Keep it simple**
   - Don't create files you don't need
   - Start minimal, add structure as needed

5. **Follow naming conventions**
   - Server functions: `get*` (reads), `create*Action`, `update*Action` (writes)
   - Hooks: `use*` pattern
   - Schemas: `*Schema` suffix, types: `*Data` suffix
