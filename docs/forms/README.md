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
import { FormError } from '@/components/ui/form';

<FormError error={form.formState.errors.root} />
```

### Displaying Field-Level Errors

Reusable field components (TextField, SelectField, etc.) automatically display field-level errors. For custom Controller usage, use `FieldError` directly:

```typescript
import { FieldError } from '@/components/ui/fields';

{!!fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}
```

## Utilities

- `setServerErrors()` - Sets server errors in React Hook Form (field + form-level)
- `mapZodErrors()` - Maps Zod validation errors to form errors
- `mapConvexErrorToFormErrors()` - Maps Convex errors to form errors

## Component Features

### Form Component
- Must be wrapped with `FormProvider` from React Hook Form
- Sets `noValidate={true}` by default to prevent HTML5 validation (React Hook Form handles all validation)
- Usage:
```typescript
import { FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';

<FormProvider {...form}>
  <Form onSubmit={form.handleSubmit(onSubmit)}>
    {/* fields */}
  </Form>
</FormProvider>
```

### FieldLabel Component
- Automatically displays a red asterisk (`*`) when `required={true}` is passed
- Usage: `<FieldLabel required>Title</FieldLabel>`

### FieldControl Component
- Automatically sets `aria-invalid="true"` when `error` prop is provided
- Usage: `<FieldControl error={fieldState.error} {...field} />`

### FieldError Component
- Displays field-level validation errors
- Used internally by reusable field components
- For custom Controller usage: `{!!fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}`

### FormError Component
- Displays form-level (non-field) errors
- Automatically handles null/undefined (returns null if no error)
- Usage: `<FormError error={form.formState.errors.root} />`

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
