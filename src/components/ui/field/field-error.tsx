'use client';

import type { FieldError as FieldErrorType, FieldErrors, FieldValues } from 'react-hook-form';

import { useMemo } from 'react';

import { cn } from '@/utils';
import { FieldError as BaseFieldError } from '../primitives/field';

type FieldErrorProps = Omit<React.ComponentProps<typeof BaseFieldError>, 'match' | 'children'> & {
  error?: FieldErrorType | FieldErrorType[] | FieldErrors<FieldValues>['root'];
  match?: React.ComponentProps<typeof BaseFieldError>['match'];
  children?: React.ReactNode;
};

export function FieldError({
  className,
  children,
  error,
  match: matchProp,
  ...props
}: FieldErrorProps) {
  const match = matchProp ? matchProp : Boolean(error);

  const content = useMemo(() => {
    if (children) {
      return children;
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

    if (error?.message) {
      return error.message;
    }

    return null;
  }, [children, error]);

  if (!(content && match)) {
    return null;
  }

  return (
    <BaseFieldError
      className={cn('text-destructive-foreground text-xs', className)}
      match={match}
      {...props}
    >
      {content}
    </BaseFieldError>
  );
}
