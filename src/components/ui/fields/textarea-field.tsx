'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel, Textarea } from '@/components/ui';

interface TextareaFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

/**
 * Reusable textarea field component that wraps Controller + Field + Textarea.
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <TextareaField
 *   control={form.control}
 *   label="Description"
 *   name="description"
 *   rows={4}
 * />
 * ```
 */
export function TextareaField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  placeholder,
  required,
  rows,
}: TextareaFieldProps<T>) {
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
          <Textarea
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            required={required}
            rows={rows}
            size="lg"
            {...field}
          />
          {!!fieldState.error && <FieldError match>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
    />
  );
}
