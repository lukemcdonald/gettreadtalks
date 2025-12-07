# Forms Documentation

This directory contains documentation for form patterns and best practices used in this application.

## Documents

- **[Data Flow](./data-flow.md)**: Complete 7-step data flow from user input to database persistence
- **[Error Handling](./error-handling.md)**: How to handle and display server-side errors with React Hook Form
- **[Server Actions](./server-actions.md)**: Standard pattern for creating Server Actions that work with forms

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
import { FormError } from '@/components/ui/form-error';

<FormError error={form.formState.errors.root} />
```

### Displaying Field-Level Errors

```typescript
{fieldState.error && (
  <FieldError>{fieldState.error.message}</FieldError>
)}
```

## Utilities

- `setServerErrors()` - Sets server errors in React Hook Form (field + form-level)
- `mapZodErrors()` - Maps Zod validation errors to form errors
- `mapConvexErrorToFormErrors()` - Maps Convex errors to form errors

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
