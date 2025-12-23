'use client';

import { FieldLabel as BaseFieldLabel } from '../primitives/field';

type FieldLabelProps = React.ComponentProps<typeof BaseFieldLabel> & {
  required?: boolean;
};

/**
 * Field label component with optional required indicator.
 * Automatically displays a red asterisk (*) when required={true}.
 *
 * @example
 * ```tsx
 * <FieldLabel required>Title</FieldLabel>
 * ```
 */
export function FieldLabel({ className, required, children, ...props }: FieldLabelProps) {
  return (
    <BaseFieldLabel className={className} {...props}>
      {children}
      {required && <span className="text-destructive">*</span>}
    </BaseFieldLabel>
  );
}
