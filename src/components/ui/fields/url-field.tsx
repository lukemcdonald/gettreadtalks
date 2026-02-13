'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel, Input } from '@/components/ui';

interface UrlFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
}

/**
 * Reusable URL input field component that wraps Controller + Field + Input with type="url".
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <UrlField
 *   control={form.control}
 *   label="Media URL"
 *   name="mediaUrl"
 *   required
 * />
 * ```
 */
export function UrlField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  placeholder,
  required,
}: UrlFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          dirty={fieldState.isDirty}
          invalid={fieldState.invalid}
          name={field.name}
          touched={fieldState.isTouched}
        >
          <FieldLabel required={required}>{label}</FieldLabel>
          {!!description && <FieldDescription>{description}</FieldDescription>}
          <Input
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            required={required}
            size="lg"
            type="url"
            {...field}
          />
          {!!fieldState.error && <FieldError match>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
    />
  );
}
