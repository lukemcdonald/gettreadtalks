# Form Error Handling

This document describes how server-side errors are handled and displayed in forms using React Hook Form.

## Overview

Server-side errors (from Server Actions and Convex mutations) are handled differently from client-side validation errors. Client-side errors are automatically managed by React Hook Form via `zodResolver`, but server-side errors must be manually set using React Hook Form's `setError` method.

## Error Types

### Field-Level Errors
Errors that relate to specific form fields (e.g., "Title is required", "Email is invalid").

### Form-Level Errors
Errors that don't relate to a specific field (e.g., "Network error", "Unauthorized", "Duplicate slug").

## Server Error Format

Server Actions return errors in this format:

```typescript
{
  success: false,
  errors: {
    fieldName: "Error message",
    _form: "Form-level error message" // Optional
  }
}
```

The `_form` key is used for form-level (non-field) errors.

## Setting Server Errors

Use the `setServerErrors` utility function to set server errors in React Hook Form:

```typescript
import { setServerErrors } from '@/lib/forms/react-hook-form';

const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

const handleSubmit = async (values: FormData) => {
  const result = await createItemAction(values);
  
  if (!result.success) {
    setServerErrors(form.setError, result.errors);
    return;
  }
  
  // Handle success...
};
```

## Displaying Errors

### Field-Level Errors
Field errors are automatically displayed via `fieldState.error`:

```typescript
<Controller
  control={form.control}
  name="title"
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel>Title</FieldLabel>
      <FieldControl>
        <Input {...field} />
      </FieldControl>
      {fieldState.error && (
        <FieldError>{fieldState.error.message}</FieldError>
      )}
    </Field>
  )}
/>
```

### Form-Level Errors
Form-level errors are stored in React Hook Form's `root` error. Use the `FormError` component to display them:

```typescript
import { FormError } from '@/components/ui/form-error';

<FormError error={form.formState.errors.root} />
```

The `FormError` component:
- Automatically handles null/undefined errors (returns null if no error)
- Provides consistent styling across all forms
- Includes proper accessibility attributes (`role="alert"`)
- Can also accept a direct message prop for custom errors

## How `setServerErrors` Works

The utility function:
1. Extracts form-level errors (`_form` key) and sets them via `setError('root', { type: 'server', message })`
2. Sets all field-level errors via `setError(fieldName, { type: 'server', message })`

This follows React Hook Form's recommended pattern for server-side errors. See: [React Hook Form - setError](https://react-hook-form.com/docs/useform/seterror)

## Clearing Errors

React Hook Form provides `clearErrors()` to clear all errors:

```typescript
form.clearErrors(); // Clears all errors (field + root)
```

## Complete Example

```typescript
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { createItemAction } from '@/features/items/actions';
import { itemSchema } from '@/features/items/schemas/item-form';

import { FormError } from '@/components/ui/form-error';

export function ItemForm() {
  const [isPending, startTransition] = useTransition();
  
  const form = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: { title: '', description: '' },
  });

  const handleSubmit = (values: z.infer<typeof itemSchema>) => {
    form.clearErrors();
    
    startTransition(async () => {
      const result = await createItemAction(values);
      
      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }
      
      // Handle success...
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Form-level error */}
      <FormError error={form.formState.errors.root} />
      
      {/* Field with error display */}
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <FieldControl>
              <Input {...field} />
            </FieldControl>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      
      <Button type="submit" disabled={isPending}>
        Submit
      </Button>
    </form>
  );
}
```

## References

- [React Hook Form - setError](https://react-hook-form.com/docs/useform/seterror)
- [React Hook Form - Error Handling](https://react-hook-form.com/docs/useform/errors)
