'use client';

import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/utils';
import { FieldError as FieldErrorComponent } from '../field/field-error';

type FormErrorProps = {
  className?: string;
  error?: FieldError | FieldError[] | FieldErrors<FieldValues>['root'];
};

/**
 * Displays form-level (non-field) error messages.
 * Reuses FieldError's error handling logic with form-specific styling.
 *
 * @example
 * ```tsx
 * <FormError error={form.formState.errors.root} />
 * <FormError error={[error1, error2]} />
 * ```
 */
export function FormError({ className, error }: FormErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <div
      className={cn('rounded-md bg-destructive/15 p-3', className)}
      data-slot="form-error"
      role="alert"
    >
      <FieldErrorComponent error={error} />
    </div>
  );
}
