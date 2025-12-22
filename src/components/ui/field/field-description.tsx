'use client';

import { FieldDescription as BaseFieldDescription } from '../primitives/field';

type FieldDescriptionProps = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Displays field description text.
 * Handles conditional rendering internally - returns null if no children provided.
 * Follows the same pattern as FieldError for consistency.
 *
 * @example
 * ```tsx
 * <FieldDescription>Enter a descriptive title</FieldDescription>
 * ```
 */
export function FieldDescription({ children, className, ...props }: FieldDescriptionProps) {
  if (!children) {
    return null;
  }

  return (
    <BaseFieldDescription className={className} {...props}>
      {children}
    </BaseFieldDescription>
  );
}
