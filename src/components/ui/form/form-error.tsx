'use client';

import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

import { cn } from '@/utils';

import { Field, FieldError as FieldErrorComponent } from '../primitives/field';

interface FormErrorProps {
  className?: string;
  error?: FieldError | FieldError[] | FieldErrors<FieldValues>['root'];
}

function uniqueErrorMessages(errors: FieldError[]) {
  return [...new Map(errors.map((err) => [err.message, err])).values()]
    .map((err) => err.message)
    .filter((message): message is string => Boolean(message));
}

function getErrorMessage(error: FormErrorProps['error']) {
  if (!error) {
    return null;
  }

  if (!Array.isArray(error)) {
    return error.message;
  }

  return formatErrorMessages(uniqueErrorMessages(error));
}

function formatErrorMessages(messages: string[]) {
  if (messages.length <= 1) {
    return messages[0] ?? null;
  }

  return (
    <ul className="ml-4 flex list-disc flex-col gap-1">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
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
    <Field
      className={cn('bg-destructive/15 rounded-md p-3', className)}
      data-slot="form-error"
      invalid
      role="alert"
    >
      <FieldErrorComponent match>{errorMessage}</FieldErrorComponent>
    </Field>
  );
}
