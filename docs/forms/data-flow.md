# Form Data Flow

This document outlines the complete data flow for form submissions in our application, from user input to database persistence.

## Overview

Our forms use a three-layer validation architecture with React Hook Form for client-side state management and Server Actions for server-side processing.

## Data Flow Steps

### 1. User Types
User interacts with form fields. React Hook Form manages all form state automatically.

### 2. React Hook Form (Client)
- Manages form state (values, touched, dirty, etc.)
- Validates with Zod via `zodResolver` (client-side validation)
- Shows validation errors automatically via `fieldState.error`
- Provides `handleSubmit` wrapper that validates before calling your handler

### 3. User Submits
User clicks submit button. React Hook Form's `handleSubmit` is called.

### 4. Client Validation (Zod via zodResolver)
- React Hook Form automatically validates using the Zod schema
- If validation fails → React Hook Form shows errors automatically (no submission)
- If validation passes → Your `handleSubmit` callback is called with validated, typed values

### 5. Server Action (Server)
- **Security layer**: Validates again with Zod (client validation can be bypassed)
- If validation fails → Returns `{ success: false, errors: {...} }`
- If validation passes → Calls Convex mutation with validated data

### 6. Convex Mutation (Backend)
- **Data integrity layer**: Validates with `v.validators` (final check)
- If validation fails → Throws `ConvexError` with structured error data (including `field` property)
- If validation passes → Saves to database

### 7. Error Flow Back
Errors flow back through the chain:
- `ConvexError` → Server Action maps to form errors → Form receives `{ success: false, errors: {...} }`
- Form uses `setServerErrors()` utility to set errors in React Hook Form
- React Hook Form displays errors automatically via `fieldState.error` (field errors) or `formState.errors.root` (form-level errors)

## Why Three Validation Layers?

1. **Client-side (React Hook Form + Zod)**: Provides immediate UX feedback without server round-trip
2. **Server-side (Zod in Server Action)**: Security - client validation can be bypassed, so we must validate on server
3. **Backend (Convex validators)**: Data integrity - final check before database write, ensures data consistency

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
