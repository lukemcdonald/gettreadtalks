'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { Checkbox, Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui';

type CheckboxFieldProps<T extends FieldValues> = {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
};

/**
 * Reusable checkbox field component that wraps Controller + Field + Checkbox.
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <CheckboxField
 *   control={form.control}
 *   label="Featured"
 *   name="featured"
 * />
 * ```
 */
export function CheckboxField<T extends FieldValues>({
  control,
  description,
  label,
  name,
}: CheckboxFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field invalid={fieldState.invalid} name={field.name}>
          <FieldLabel>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            {label}
          </FieldLabel>
          <FieldDescription>{description}</FieldDescription>
          <FieldError error={fieldState.error} />
        </Field>
      )}
    />
  );
}
