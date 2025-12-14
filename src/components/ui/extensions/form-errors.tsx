'use client';

import type { FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/utils';

type FormErrorProps = {
  className?: string;
  error?: FieldErrors<FieldValues>['root'];
  message?: string;
};

/**
 * Displays form-level (non-field) error messages.
 *
 * @example
 * ```tsx
 * <FormError error={form.formState.errors.root} />
 * <FormError message="Network error" />
 * ```
 */
export function FormError({ error, message, className }: FormErrorProps) {
  const errorMessage = error?.message || message;

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      className={cn('rounded-md bg-destructive/15 p-3 text-destructive text-sm', className)}
      data-slot="form-message"
      role="alert"
    >
      {errorMessage}
    </div>
  );
}

