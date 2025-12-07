import type { FieldError } from 'react-hook-form';

import { cn } from '@/utils';

type FieldMessageProps = {
  children?: React.ReactNode;
  className?: string;
  error?: FieldError;
};

/**
 * Displays field-level error messages with consistent styling.
 * Used within form fields to show validation errors.
 */
export function FieldMessage({ children, className, error }: FieldMessageProps) {
  const message = error?.message ?? children;

  if (!message) {
    return null;
  }

  return (
    <p className={cn('font-medium text-destructive-foreground text-xs', className)} role="alert">
      {message}
    </p>
  );
}
