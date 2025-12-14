'use client';

import type { FieldErrors, FieldValues } from 'react-hook-form';

import { useMemo } from 'react';

import { cn } from '@/utils';
import { FieldError as BaseFieldError } from '../primitives/field';

/**
 * Enhanced field-level error component that supports error arrays and deduplication.
 *
 * @param className - The class name to apply to the field error.
 * @param children - The children to render inside the field error.
 * @param errors - The errors to render inside the field error. If not provided, the component will render the children.
 * @param props - The props to apply to the field error.
 * @returns The field error component.
 */
export function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<typeof BaseFieldError> & {
  errors?: FieldErrors<FieldValues>['root'][];
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
        {uniqueErrors.map(
          (error) => error?.message && <li key={error.message}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <BaseFieldError className={cn('text-destructive-foreground text-xs', className)} {...props}>
      {content}
    </BaseFieldError>
  );
}
