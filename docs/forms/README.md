# Forms Documentation

This directory contains documentation for form patterns and best practices used in this application.

## Documents

- **[Data Flow](./data-flow.md)**: Complete 7-step data flow from user input to database persistence
- **[Error Handling](./error-handling.md)**: How to handle and display server-side errors with React Hook Form
- **[Server Actions](./server-actions.md)**: Standard pattern for creating Server Actions that work with forms
- **[Reusable Fields](./reusable-fields.md)**: Reusable form field components for consistent form implementation

## Quick Reference

### Setting Server Errors

```typescript
import { setServerErrors } from '@/lib/forms/react-hook-form';

if (!result.success) {
  setServerErrors(form.setError, result.errors);
}
```

### Displaying Form-Level Errors

```typescript
import { FormMessage } from '@/components/ui/form-message';

<FormMessage error={form.formState.errors.root} />
```

### Displaying Field-Level Errors

```typescript
import { FieldMessage } from '@/components/ui/field-message';

<FieldMessage error={fieldState.error} />
```

## Utilities

- `setServerErrors()` - Sets server errors in React Hook Form (field + form-level)
- `mapZodErrors()` - Maps Zod validation errors to form errors
- `mapConvexErrorToFormErrors()` - Maps Convex errors to form errors

## Component Features

### Form Component
- Automatically wraps children with `FormProvider` when `form` prop is provided
- Sets `noValidate={true}` by default to prevent HTML5 validation (React Hook Form handles all validation)
- Usage: `<Form form={form} onSubmit={form.handleSubmit(onSubmit)}>`

### FieldLabel Component
- Automatically displays a red asterisk (`*`) when `required={true}` is passed
- Usage: `<FieldLabel required>Title</FieldLabel>`

### FieldControl Component
- Automatically sets `aria-invalid="true"` when `error` prop is provided
- Usage: `<FieldControl error={fieldState.error} {...field} />`

### FieldMessage Component
- Displays field-level validation errors
- Automatically handles null/undefined (returns null if no error)
- Usage: `<FieldMessage error={fieldState.error} />`

### FormMessage Component
- Displays form-level (non-field) errors
- Automatically handles null/undefined (returns null if no error)
- Can accept either `error` prop (from `form.formState.errors.root`) or `message` prop
- Usage: `<FormMessage error={form.formState.errors.root} />`

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
