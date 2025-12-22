'use client';

/**
 * Displays a red asterisk (*) to indicate a required field.
 * Returns null if not required, following the same pattern as FieldError.
 *
 * @example
 * ```tsx
 * <FieldLabel>
 *   Title
 *   <FieldRequired required={true} />
 * </FieldLabel>
 * ```
 */
export function FieldRequired({ required }: { required?: boolean }) {
  if (!required) {
    return null;
  }

  return <span className="text-destructive">*</span>;
}
