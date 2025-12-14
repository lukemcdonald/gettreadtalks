'use client';

import type { FieldErrors, FieldValues } from 'react-hook-form';

import { useMemo } from 'react';

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
 * <FormMessage error={form.formState.errors.root} />
 * <FormMessage message="Network error" />
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

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(({ message }) => message && <li key={message}>{message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return <FieldError {...props}>{content}</FieldError>;
}
