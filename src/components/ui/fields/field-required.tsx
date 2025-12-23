'use client';

/**
 * Displays a red asterisk (*) to indicate a required field.
 * Component should be conditionally rendered at the call site.
 *
 * @example
 * ```tsx
 * <FieldLabel>
 *   Title
 *   {required && <FieldRequired />}
 * </FieldLabel>
 * ```
 */
export function FieldRequired() {
  return <span className="text-destructive">*</span>;
}
