'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel, Input } from '@/components/ui';

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel';
}

/**
 * Reusable text input field component that wraps Controller + Field + Input.
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <TextField
 *   control={form.control}
 *   label="Title"
 *   name="title"
 *   required
 * />
 * ```
 */
export function TextField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  placeholder,
  required,
  type = 'text',
}: TextFieldProps<T>) {
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
            type={type}
            {...field}
          />
          {!!fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
    />
  );
}
