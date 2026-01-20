'use client';

import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/utils';
import { FieldError as FieldErrorComponent } from '../fields';

interface FormErrorProps {
  className?: string;
  error?: FieldError | FieldError[] | FieldErrors<FieldValues>['root'];
}

function getErrorMessage(error: FormErrorProps['error']) {
  if (!error) {
    return null;
  }

  if (Array.isArray(error)) {
    const uniqueErrors = [...new Map(error.map((err) => [err?.message, err])).values()];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((err) => err?.message && <li key={err.message}>{err.message}</li>)}
      </ul>
    );
  }

  return error?.message;
}

/**
 * Displays form-level (non-field) error messages.
 * Handles single errors, arrays of errors, and root form errors.
 *
 * @example
 * ```tsx
 * {form.formState.errors.root && (
 *   <FormError error={form.formState.errors.root} />
 * )}
 * ```
 */
export function FormError({ className, error }: FormErrorProps) {
  const errorMessage = getErrorMessage(error);

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      className={cn('rounded-md bg-destructive/15 p-3', className)}
      data-slot="form-error"
      role="alert"
    >
      <FieldErrorComponent>{errorMessage}</FieldErrorComponent>
    </div>
  );
}
