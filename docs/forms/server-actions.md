# Server Actions Pattern

This document describes the standard pattern for creating Server Actions that work with forms.

## Overview

Server Actions provide a secure way to handle form submissions on the server. They validate input, check authorization, call Convex mutations, and return structured error responses.

## Standard Pattern

```typescript
'use server';
import 'server-only';

import { fetchMutation } from 'convex/nextjs';
import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { withConvexAuth } from '@/lib/convex/server-action';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { requireAdminUser } from '@/services/auth/server';
import { formSchema, type FormData } from './schemas/form-schema';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

export async function createItemAction(
  data: unknown
): Promise<ActionResult<{ itemId: string }>> {
  // 1. Authorization check
  await requireAdminUser();

  // 2. Server-side validation (security layer)
  const parsed = formSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: mapZodErrors(parsed.error) };
  }

  const validatedData: FormData = parsed.data;

  try {
    // 3. Call Convex mutation
    const itemId = await withConvexAuth(
      async (token) =>
        await fetchMutation(api.items.createItem, validatedData, { token })
    );

    return {
      success: true,
      data: { itemId },
    };
  } catch (error) {
    // 4. Map Convex errors to form errors
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
```

## Key Components

### 1. Directives
- `'use server'`: Marks the function as a Server Action
- `'server-only'`: Ensures the module only runs on the server (prevents accidental client-side usage)

### 2. Authorization
Always check authorization at the start of the Server Action:

```typescript
await requireAdminUser(); // or requireAuth(), etc.
```

### 3. Server-Side Validation
Validate input with Zod (client validation can be bypassed):

```typescript
const parsed = formSchema.safeParse(data);
if (!parsed.success) {
  return { success: false, errors: mapZodErrors(parsed.error) };
}
```

### 4. Convex Mutation Call
Use `withConvexAuth` wrapper to automatically handle authentication token:

```typescript
const result = await withConvexAuth(
  async (token) =>
    await fetchMutation(api.items.createItem, validatedData, { token })
);
```

### 5. Error Mapping
Map Convex errors to form errors using the utility function:

```typescript
catch (error) {
  return {
    success: false,
    errors: mapConvexErrorToFormErrors(error),
  };
}
```

## Return Type

Server Actions return a discriminated union:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };
```

- **Success**: `{ success: true, data: {...} }`
- **Error**: `{ success: false, errors: { fieldName: "message", _form?: "message" } }`

The `_form` key in errors is used for form-level (non-field) errors.

## Update Pattern

For update actions, include the ID parameter:

```typescript
export async function updateItemAction(
  itemId: ItemId,
  data: unknown
): Promise<ActionResult<{ itemId: string }>> {
  await requireAdminUser();

  const parsed = formSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: mapZodErrors(parsed.error) };
  }

  const validatedData: FormData = parsed.data;

  try {
    await withConvexAuth(
      async (token) =>
        await fetchMutation(
          api.items.updateItem,
          { ...validatedData, id: itemId },
          { token }
        )
    );

    return {
      success: true,
      data: { itemId },
    };
  } catch (error) {
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
```

## Error Mapping Details

### Zod Errors
Zod validation errors are mapped to field-level errors via `mapZodErrors()`:

```typescript
// Zod error: { path: ['title'], message: 'Required' }
// Maps to: { title: 'Required' }
```

### Convex Errors
Convex errors are mapped using structured error data:

```typescript
// Convex error with field property: { data: { field: 'title' }, message: 'Duplicate' }
// Maps to: { title: 'Duplicate' }

// Convex error without field: { message: 'Network error' }
// Maps to: { _form: 'Network error' }
```

See `src/lib/forms/validation.ts` for implementation details.

## Security Considerations

1. **Always validate on server**: Client validation can be bypassed
2. **Always check authorization**: Don't trust client-side auth state
3. **Use `'server-only'`**: Prevents accidental client-side usage
4. **Type safety**: Use `unknown` for input, validate with Zod, then use typed data

## References

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Hook Form - Server Actions](https://react-hook-form.com/docs/useform/handlesubmit#server-actions)
