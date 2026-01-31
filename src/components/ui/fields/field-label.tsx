'use client';

import type { ComponentProps } from 'react';

import { FieldLabel as BaseFieldLabel } from '../primitives/field';

type FieldLabelProps = ComponentProps<typeof BaseFieldLabel> & {
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
export function FieldLabel({ className, required, children, ...delegated }: FieldLabelProps) {
  return (
    <BaseFieldLabel className={className} {...delegated}>
      {children}
      {!!required && <span className="text-destructive">*</span>}
    </BaseFieldLabel>
  );
}
